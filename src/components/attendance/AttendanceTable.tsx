import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DashboardAttendance } from '@/lib/api/dashboard';

interface AttendanceTableProps {
  attendances: DashboardAttendance[];
}

export function AttendanceTable({ attendances }: AttendanceTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Roll No.</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                No attendance records found.
              </TableCell>
            </TableRow>
          ) : (
            attendances.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  {new Date(record.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{record.student?.name || 'Unknown'}</TableCell>
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
  );
}
