"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, FileText, Award } from "lucide-react"
import DashboardLayout from "@/dashboard-layout" 

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    attendanceRate: 0,
    pendingAssignments: 0,
    averageGrade: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setStats({
        totalSubjects: 8,
        attendanceRate: 92,
        pendingAssignments: 3,
        averageGrade: 85,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600">Track your academic progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubjects}</div>
              <p className="text-xs text-muted-foreground">Enrolled subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
              <p className="text-xs text-muted-foreground">Pending submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageGrade}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>View and submit assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  View Assignments
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  Submit Work
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grades</CardTitle>
              <CardDescription>Check your academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  View Grades
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  Progress Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Track your attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  View Attendance
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  Request Leave
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <CardDescription>Your latest assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Mathematics Quiz</h4>
                  <p className="text-sm text-gray-500">Chapter 5: Algebra</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">92/100</p>
                  <p className="text-sm text-gray-500">A Grade</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Physics Lab Report</h4>
                  <p className="text-sm text-gray-500">Experiment 3</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">88/100</p>
                  <p className="text-sm text-gray-500">B+ Grade</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">English Essay</h4>
                  <p className="text-sm text-gray-500">Creative Writing</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">95/100</p>
                  <p className="text-sm text-gray-500">A+ Grade</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
