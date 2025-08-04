"use client"

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
import {
  FaUsers,
  FaCalendarAlt,
  FaBookOpen,
  FaCog,
  FaSignOutAlt,
  FaGraduationCap,
  FaDollarSign,
  FaFileAlt,
  FaTh,
  FaPersonBooth,
} from "react-icons/fa"
import { ReactNode } from "react"

interface AppSidebarProps {
  user: any
}

interface MenuItem {
  title: string
  url: string
  icon: ReactNode
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter()
  const userRole = user?.role?.name?.toLowerCase() || "guest"

  const handleLogout = () => {
    api.clearToken()
    router.push("/login")
  }

  const getMenuItems = (): MenuItem[] => {
    const commonItems = [
      {
        title: "Dashboard",
        url: `/dashboard/${userRole}`,
        icon: <FaTh />,
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
            icon: <FaGraduationCap />,
          },
          {
            title: "Staff",
            url: "/dashboard/admin/staff",
            icon: <FaUsers />,
          },
          {
            title: "Attendance",
            url: "/dashboard/principal/attendance",
            icon: <FaCalendarAlt />,
          },
          {
            title: "Fees",
            url: "/dashboard/admin/fees",
            icon: <FaDollarSign />,
          },
          {
            title: "Reports",
            url: "/dashboard/admin/reports",
            icon: <FaFileAlt />,
          },

                 {
            title: "Profile",
            url: "/dashboard/profile",
            icon: <FaPersonBooth />,
          },
          {
            title: "Settings",
            url: "/dashboard/admin/settings",
            icon: <FaCog />,
          },
        ]

      case "teacher":
        return [
          ...commonItems,
          {
            title: "My Classes",
            url: "/dashboard/teacher/classes",
            icon: <FaBookOpen />,
          },
          {
            title: "Attendance",
            url: "/dashboard/teacher/attendance",
            icon: <FaCalendarAlt />,
          },
          {
            title: "Assignments",
            url: "/dashboard/teacher/assignments",
            icon: <FaFileAlt />,
          },
          {
            title: "Students",
            url: "/dashboard/teacher/students",
            icon: <FaUsers />,
          },
             {
            title: "Profile",
            url: "/dashboard/profile",
            icon: <FaPersonBooth />,
          },
        ]

      case "student":
        return [
          ...commonItems,
          {
            title: "My Subjects",
            url: "/dashboard/student/subjects",
            icon: <FaBookOpen />,
          },
          {
            title: "Attendance",
            url: "/dashboard/student/attendance",
            icon: <FaCalendarAlt />,
          },
          {
            title: "Assignments",
            url: "/dashboard/student/assignments",
            icon: <FaFileAlt />,
          },
          {
            title: "Fees",
            url: "/dashboard/student/fees",
            icon: <FaDollarSign />,
          },
                {
            title: "Profile",
            url: "/dashboard/profile",
            icon: <FaPersonBooth />,
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
          <FaGraduationCap className="h-6 w-6" />
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
                      <span className="mr-2">{item.icon}</span>
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
          <FaSignOutAlt className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
