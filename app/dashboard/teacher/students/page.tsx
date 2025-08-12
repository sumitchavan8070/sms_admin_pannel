"use client"

import { SetStateAction, useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Users, CalendarIcon, Download, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Checkbox from "./components/input/Checkbox"

interface Student {
  id: number
  name: string
  profile: string
  status: "present" | "absent" | null
  remarks: string
  lastUpdated: string
  attendanceDate: string
}

export default function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    leave: 0,
    rate: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd"); // Use a consistent format
        const res = await api.getClassStudents(formattedDate);

        // Check if the API response is successful and contains the expected data structure
        if (res.status !== 1 || !res.result) {
          toast.error("Failed to fetch students data or invalid response format.");
          // Reset stats if there's an error
          setAttendanceStats({ total: 0, present: 0, absent: 0, leave: 0, rate: 0 });
          setStudents([]);
          return;
        }

        // Extract stats directly from the response
        const total = res.totalStudents ?? 0;
        const present = res.presentStudents ?? 0;
        const absent = res.absentStudents ?? 0;
        const leave = res.leaveStudents ?? 0;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;

        setAttendanceStats({
          total,
          present,
          absent,
          leave,
          rate,
        });

        // Map students for the UI
        const formatted: Student[] = res.result.map((item: any) => ({
          id: item.student_id,
          name: item.student_name,
          profile: (() => {
            const [first, last] = item.student_name.split(" ");
            const initials = `${first?.[0] || "J"}${last?.[0] || "D"}`.toUpperCase();
            return `https://placehold.co/96x96/6366F1/FFFFFF?text=${initials}`;
          })(),
          status: item.attendance_status === "present" ? "present" : item.attendance_status === "absent" ? "absent" : null,
          remarks: item.remarks || "", // Use existing remarks if available
          lastUpdated: item.lastUpdated ? new Date(item.lastUpdated).toLocaleTimeString() : "Not updated yet",
          attendanceDate: formattedDate,
        }));

        setStudents(formatted);

        toast.success(`Fetched attendance for ${formattedDate}. Total students: ${total}, Present: ${present}, Absent: ${absent}.`);

      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("An error occurred while fetching students.");
        // Reset stats on error
        setAttendanceStats({ total: 0, present: 0, absent: 0, leave: 0, rate: 0 });
        setStudents([]);
      }
    };

    fetchData();
  }, [selectedDate]);


  const toggleStatus = (id: number, status: "present" | "absent") => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
            ...s,
            status: s.status === status ? null : status,
            lastUpdated: `Updated on ${new Date().toLocaleTimeString()}`,
          }
          : s
      )
    )
  }

  const updateRemarks = (id: number, value: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
            ...s,
            remarks: value,
            lastUpdated: `Updated on ${new Date().toLocaleTimeString()}`,
          }
          : s
      )
    )
  }

  const markAttendance = async () => {
    const today = format(selectedDate, "yyyy-MM-dd");

    // Build bulk attendance payload
    const attendanceList = students
      .filter((s) => s.status) // only students with a marked status
      .map((s) => ({
        student_id: s.id,
        date: today,
        status: s.status,
        remarks: s.remarks || null,
      }));

    if (attendanceList.length === 0) {
      toast.info("No attendance to mark. Please select at least one student's status.");
      return;
    }
    console.log(attendanceList);


    try {
      // Bulk API call
      const res = await api.markBulkAttendance({
        records: attendanceList
      });

      if (res.status === 1) {
        toast.success(res.message || "Attendance marked successfully");
      } else {
        toast.error(res.message || "Failed to mark attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("An error occurred while marking attendance");
    }
  };


  const updateSingleAttendance = async (student: Student) => {
    if (!student.status) {
      toast.error(`Please mark Present or Absent for ${student.name}`);
      return;
    }

    try {
      const res = await api.markAttendance({
        student_id: student.id,
        date: format(selectedDate, "yyyy-MM-dd"), // Ensure the date is consistent
        status: student.status,
        remarks: student.remarks,
      });

      if (res.status === 1) {
        toast.success(`Attendance updated for ${student.name}`);
        setStudents((prev) =>
          prev.map((s) =>
            s.id === student.id
              ? { ...s, lastUpdated: `Updated on ${new Date().toLocaleTimeString()}` }
              : s
          )
        );
      } else {
        toast.error(`Failed to update ${student.name}`);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error(`Error updating ${student.name}`);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage staff and student attendance
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date: SetStateAction<Date>) => date && setSelectedDate(date)}
                initialFocus
                required
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <hr />

      {/* Attendance Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Present</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.present}</div>
            <p className="text-xs text-muted-foreground">
              Out of {attendanceStats.total} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.rate}%</div>
            <Progress value={attendanceStats.rate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Absent</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.absent}</div>
            <p className="text-xs text-muted-foreground">
              Out of {attendanceStats.total} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.leave}</div>
            <p className="text-xs text-muted-foreground">
              Out of {attendanceStats.total} students
            </p>
          </CardContent>
        </Card>
      </div>

      <hr />

      {/* Table */}
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold">Manage Attendance</h2>
        <Button onClick={markAttendance} className="bg-indigo-600 text-white hover:bg-indigo-700">
          Mark Attendance
        </Button>
      </div>

      <div className="overflow-hidden p-8 rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-medium">Student</TableCell>
                  <TableCell className="font-medium">P</TableCell>
                  <TableCell className="font-medium">A</TableCell>
                  <TableCell className="font-medium">Remarks</TableCell>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell className="font-medium">Date</TableCell>
                  <TableCell className="font-medium">Update</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={student.profile}
                            alt={student.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={student.status === "present"}
                          onChange={() => toggleStatus(student.id, "present")}
                          className="checked:bg-green-600"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={student.status === "absent"}
                          onChange={() => toggleStatus(student.id, "absent")}
                          className="checked:bg-red-600"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          placeholder="Add remark"
                          value={student.remarks}
                          onChange={(e) => updateRemarks(student.id, e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="capitalize text-gray-700">
                        {student.status ?? "Not marked"}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {student.attendanceDate}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => updateSingleAttendance(student)}>
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No students found for this date.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}