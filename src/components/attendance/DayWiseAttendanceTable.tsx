'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ClassDaySummary } from '@/lib/api/dashboard';

interface DayWiseAttendanceTableProps {
  summaries: ClassDaySummary[];
}

export function DayWiseAttendanceTable({ summaries }: DayWiseAttendanceTableProps) {
  const [selectedSummary, setSelectedSummary] = useState<ClassDaySummary | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT' | 'LATE'>('ALL');
  
  // Date filter
  const todayStr = new Date().toISOString().split('T')[0];
  const [dateFilter, setDateFilter] = useState<string>(''); // Empty means all dates

  const openDetails = (summary: ClassDaySummary) => {
    setSelectedSummary(summary);
    setStatusFilter('ALL'); // Reset filter when opening
  };

  const closeDetails = () => {
    setSelectedSummary(null);
  };

  const getFilteredRecords = () => {
    if (!selectedSummary) return [];
    if (statusFilter === 'ALL') return selectedSummary.records;
    return selectedSummary.records.filter(r => r.status === statusFilter);
  };

  const filteredSummaries = useMemo(() => {
    if (!dateFilter) return summaries;
    return summaries.filter(s => s.date.startsWith(dateFilter));
  }, [summaries, dateFilter]);

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium">Filter by Date:</label>
        <Input 
          type="date" 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-auto"
        />
        {dateFilter && (
          <Button variant="ghost" onClick={() => setDateFilter('')} size="sm">
            Clear Filter
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Total Records</TableHead>
              <TableHead>Present</TableHead>
              <TableHead>Absent</TableHead>
              <TableHead>Late</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSummaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  No attendance records found for the selected date.
                </TableCell>
              </TableRow>
            ) : (
              filteredSummaries.map((summary) => {
                // Calculate percentage
                const presentPercent = summary.total > 0 
                  ? Math.round((summary.present / summary.total) * 100) 
                  : 0;

                return (
                  <TableRow key={summary.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {new Date(summary.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">{summary.className}</TableCell>
                    <TableCell>{summary.total}</TableCell>
                    <TableCell className="text-green-600 font-medium">{summary.present} ({presentPercent}%)</TableCell>
                    <TableCell className="text-red-600 font-medium">{summary.absent}</TableCell>
                    <TableCell className="text-orange-500 font-medium">{summary.late}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openDetails(summary)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedSummary} onOpenChange={(open) => !open && closeDetails()}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedSummary?.className} Attendance on {selectedSummary && new Date(selectedSummary.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </DialogTitle>
            <DialogDescription>
              Review specific student attendance records for this class on this day. Use the filter below to isolate absences or lates.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 py-4">
            <span className="text-sm font-medium">Filter by Status:</span>
            <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PRESENT">Present Only</SelectItem>
                <SelectItem value="ABSENT">Absent Only</SelectItem>
                <SelectItem value="LATE">Late Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-secondary">
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredRecords().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      No records match the current filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  getFilteredRecords().map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.student?.name || 'Unknown'}</TableCell>
                      <TableCell>{record.student?.rollNumber || '-'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            record.status === 'PRESENT' ? 'default' : 
                            record.status === 'ABSENT' ? 'destructive' : 'secondary'
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
