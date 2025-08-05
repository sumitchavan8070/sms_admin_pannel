"use client"

import { SetStateAction, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { UserCheck, Users, CalendarIcon, Search, Download, Filter, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import DashboardLayout from "@/dashboard-layout" 
import BasicTableOne from "./components/BasicTableOne"

export default function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")

  const staffAttendance = [
    {
      id: "1",
      name: "Sarah Johnson",
      department: "Mathematics",
      status: "present",
      checkIn: "08:30 AM",
      checkOut: "04:30 PM",
      workingHours: "8h 0m",
    },
    {
      id: "2",
      name: "Mike Chen",
      department: "Physics",
      status: "present",
      checkIn: "08:45 AM",
      checkOut: "04:45 PM",
      workingHours: "8h 0m",
    },
    {
      id: "3",
      name: "Emily Davis",
      department: "English",
      status: "absent",
      checkIn: "-",
      checkOut: "-",
      workingHours: "0h 0m",
      reason: "Medical Leave",
    },
    {
      id: "4",
      name: "Robert Wilson",
      department: "Administration",
      status: "late",
      checkIn: "09:15 AM",
      checkOut: "05:15 PM",
      workingHours: "8h 0m",
    },
  ]

  const studentAttendance = [
    {
      class: "Grade 10A",
      totalStudents: 32,
      present: 30,
      absent: 2,
      attendanceRate: 93.8,
    },
    {
      class: "Grade 10B",
      totalStudents: 28,
      present: 26,
      absent: 2,
      attendanceRate: 92.9,
    },
    {
      class: "Grade 11A",
      totalStudents: 35,
      present: 33,
      absent: 2,
      attendanceRate: 94.3,
    },
    {
      class: "Grade 11B",
      totalStudents: 30,
      present: 29,
      absent: 1,
      attendanceRate: 96.7,
    },
  ]

  const attendanceStats = {
    staff: {
      total: 45,
      present: 42,
      absent: 3,
      late: 1,
      rate: 93.3,
    },
    students: {
      total: 1234,
      present: 1167,
      absent: 67,
      rate: 94.5,
    },
  }

  const filteredStaff = staffAttendance.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
            <p className="text-muted-foreground">Monitor and manage staff and student attendance</p>
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
                  required // ✅ Add this line

                />
              </PopoverContent>
            </Popover>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Studdent Present</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.staff.present}</div>
              <p className="text-xs text-muted-foreground">Out of {attendanceStats.staff.total} staff</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+2% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Present</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.students.present}</div>
              <p className="text-xs text-muted-foreground">Out of {attendanceStats.students.total} students</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600">-1% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.staff.rate}%</div>
              <Progress value={attendanceStats.staff.rate} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Student Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.students.rate}%</div>
              <Progress value={attendanceStats.students.rate} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

    

            <BasicTableOne />
      </div>
    </>
  )
}
