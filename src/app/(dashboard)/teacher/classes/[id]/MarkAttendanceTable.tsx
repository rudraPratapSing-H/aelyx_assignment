'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type MarkAttendanceTableProps = {
  classId: string;
  className: string;
  students: any[];
};

export function MarkAttendanceTable({ classId, className, students }: MarkAttendanceTableProps) {
  // Default to today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const [attendance, setAttendance] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});

  // Sync attendance state whenever date or students change
  useEffect(() => {
    const nextAttendance: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    
    students.forEach((student) => {
      // Find an attendance record for this student that exactly matches the selected date (YYYY-MM-DD)
      const recordForDate = student.attendances?.find((att: any) => {
        // Handle both string dates and Date objects
        const attDateString = typeof att.date === 'string' ? att.date : new Date(att.date).toISOString();
        return attDateString.startsWith(date);
      });
      
      // If found, use its status, otherwise default to ABSENT
      nextAttendance[student.id] = recordForDate ? recordForDate.status : 'ABSENT';
    });
    
    setAttendance(nextAttendance);
  }, [date, students]);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    if (students.length === 0) {
      toast.error('No students in this class to mark attendance for.');
      return;
    }

    setLoading(true);
    try {
      const records = students.map((student) => ({
        studentId: student.id,
        status: attendance[student.id],
      }));

      const payload = {
        date,
        records,
      };

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit attendance');
      }

      toast.success(`Successfully marked attendance for ${data.count} students!`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>All students currently enrolled in {className}.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="date" className="text-sm font-medium">Date:</label>
          <Input 
            type="date" 
            id="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="w-auto"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {students.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
            No students are assigned to this class yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Select 
                      value={attendance[student.id] || 'ABSENT'} 
                      onValueChange={(val: any) => handleStatusChange(student.id, val)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRESENT" className="text-green-600 font-medium">Present</SelectItem>
                        <SelectItem value="ABSENT" className="text-red-600 font-medium">Absent</SelectItem>
                        <SelectItem value="LATE" className="text-orange-500 font-medium">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {students.length > 0 && (
        <CardFooter className="flex justify-end border-t pt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Attendance'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
