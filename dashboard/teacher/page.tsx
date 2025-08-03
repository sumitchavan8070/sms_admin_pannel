"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Calendar, CheckCircle } from "lucide-react"
import DashboardLayout from "@/dashboard-layout" 

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    myClasses: 0,
    totalStudents: 0,
    todayClasses: 0,
    pendingAssignments: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setStats({
        myClasses: 3,
        totalStudents: 85,
        todayClasses: 5,
        pendingAssignments: 12,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-gray-600">Manage your classes and students</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myClasses}</div>
              <p className="text-xs text-muted-foreground">Active classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayClasses}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
              <p className="text-xs text-muted-foreground">Assignments to grade</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Mark student attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  Mark Attendance
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  View Attendance History
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Manage assignments and grades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  Create Assignment
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  Grade Submissions
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>Manage your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  View Classes
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  Student List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Mathematics - Class 10A</h4>
                  <p className="text-sm text-gray-500">Room 101</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">9:00 AM - 10:00 AM</p>
                  <p className="text-sm text-green-600">In Progress</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Physics - Class 11B</h4>
                  <p className="text-sm text-gray-500">Room 203</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">11:00 AM - 12:00 PM</p>
                  <p className="text-sm text-blue-600">Upcoming</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Chemistry - Class 12A</h4>
                  <p className="text-sm text-gray-500">Lab 1</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">2:00 PM - 3:00 PM</p>
                  <p className="text-sm text-blue-600">Upcoming</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
