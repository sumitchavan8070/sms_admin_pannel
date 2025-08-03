"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, DollarSign, Calendar } from "lucide-react"
import DashboardLayout from "@/dashboard-layout" 

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    presentToday: 0,
    pendingFees: 0,
    upcomingEvents: 0,
  })

  useEffect(() => {
    // Fetch dashboard stats
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // This would normally fetch from your API
      setStats({
        totalUsers: 150,
        presentToday: 142,
        pendingFees: 25,
        upcomingEvents: 3,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to the school management system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Students, Teachers & Staff</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.presentToday}</div>
              <p className="text-xs text-muted-foreground">94.7% attendance rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingFees}</div>
              <p className="text-xs text-muted-foreground">Students with pending payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage students, teachers, and staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  Add New User
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  View All Users
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Track and manage attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  Mark Attendance
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fee Management</CardTitle>
              <CardDescription>Manage student fees and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  Collect Fees
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  Fee Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest activities in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New student enrolled</p>
                  <p className="text-xs text-gray-500">John Doe joined Class 10A</p>
                </div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Fee payment received</p>
                  <p className="text-xs text-gray-500">Jane Smith paid tuition fee</p>
                </div>
                <div className="text-xs text-gray-500">4 hours ago</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Leave application</p>
                  <p className="text-xs text-gray-500">Teacher requested sick leave</p>
                </div>
                <div className="text-xs text-gray-500">6 hours ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
