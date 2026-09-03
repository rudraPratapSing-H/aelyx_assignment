import { DayWiseAttendanceTable } from '@/components/attendance/DayWiseAttendanceTable';
import { getClassDayAttendanceSummary } from '@/lib/api/dashboard';

export default async function AttendancePage() {
  // Fetch aggregated data on the server
  const summaries = await getClassDayAttendanceSummary();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Daily Attendance Summary</h2>
        <p className="text-muted-foreground">
          View high-level daily attendance logs across all classes. Click 'View Details' to see specific student records.
        </p>
      </div>
      <DayWiseAttendanceTable summaries={summaries} />
    </div>
  );
}
