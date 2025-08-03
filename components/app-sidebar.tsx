"use client"

import { Home, Users, Calendar, BookOpen, Settings, LogOut, GraduationCap, DollarSign, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

interface AppSidebarProps {
  user: any
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter()
  const userRole = user?.role?.name?.toLowerCase()

  const handleLogout = () => {
    api.clearToken()
    router.push("/login")
  }

  const getMenuItems = () => {
    const commonItems = [
      {
        title: "Dashboard",
        url: `/dashboard/${userRole}`,
        icon: Home,
      },
    ]

    switch (userRole) {
      case "admin":
      case "principal":
        return [
          ...commonItems,
          {
            title: "Students",
            url: "/dashboard/admin/students",
            icon: GraduationCap,
          },
          {
            title: "Staff",
            url: "/dashboard/admin/staff",
            icon: Users,
          },
          {
            title: "Attendance",
            url: "/dashboard/principal/attendance",
            icon: Calendar,
          },
          {
            title: "Fees",
            url: "/dashboard/admin/fees",
            icon: DollarSign,
          },
          {
            title: "Reports",
            url: "/dashboard/admin/reports",
            icon: FileText,
          },
          {
            title: "Settings",
            url: "/dashboard/admin/settings",
            icon: Settings,
          },
        ]
      case "teacher":
        return [
          ...commonItems,
          {
            title: "My Classes",
            url: "/dashboard/teacher/classes",
            icon: BookOpen,
          },
          {
            title: "Attendance",
            url: "/dashboard/teacher/attendance",
            icon: Calendar,
          },
          {
            title: "Assignments",
            url: "/dashboard/teacher/assignments",
            icon: FileText,
          },
          {
            title: "Students",
            url: "/dashboard/teacher/students",
            icon: Users,
          },
        ]
      case "student":
        return [
          ...commonItems,
          {
            title: "My Subjects",
            url: "/dashboard/student/subjects",
            icon: BookOpen,
          },
          {
            title: "Attendance",
            url: "/dashboard/student/attendance",
            icon: Calendar,
          },
          {
            title: "Assignments",
            url: "/dashboard/student/assignments",
            icon: FileText,
          },
          {
            title: "Fees",
            url: "/dashboard/student/fees",
            icon: DollarSign,
          },
        ]
      default:
        return commonItems
    }
  }

  const menuItems = getMenuItems()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-semibold">School MS</span>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>
            {user?.firstName} {user?.lastName}
          </p>
          <p className="capitalize">{userRole}</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="outline" onClick={handleLogout} className="w-full bg-transparent">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
