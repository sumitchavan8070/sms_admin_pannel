"use client"

import React, { useState, useEffect } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "./table"
import Image from "next/image"
import Checkbox from "./input/Checkbox"
import Badge from "./badge/Badge"
import { api } from "@/lib/api" // Make sure this exists and exports `getClassAttendance()`
import { toast } from "sonner"


interface Student {
  id: number
  name: string
  className: string
  profile: string
  status: "Present" | "Absent" | "Leave"
  address: string
  feesPaid: boolean
  attendanceDate: string
}

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])

  // Fetch data from API
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.getClassStudents()

      if (res.status !== 1 || !Array.isArray(res.result)) {
        toast.error("Failed to fetch students")
        return
      }

      const formatted: Student[] = res.result.map((item: any) => ({
        id: item.student_id,
        name: item.student_name,
        className: item.class_name,
profile: (() => {
  const [first, last] = item.student_name.split(" ");
  const initials = `${first?.[0] || "J"}${last?.[0] || "D"}`.toUpperCase();
  return `https://placehold.co/96x96/6366F1/FFFFFF?text=${initials}`;
})(),        status: "Present", // default/fake status
        address: "-",
        feesPaid: true,
        attendanceDate: new Date().toISOString().split("T")[0],
      }))

      setStudents(formatted)
    } catch (error) {
      console.error("Error fetching students:", error)
      toast.error("An error occurred while fetching students")
    }
  }

  fetchData()
}, [])


  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-3">
                  <Checkbox
                    checked={selectedStudents.length === students.length}
                    onChange={() => {
                      if (selectedStudents.length === students.length) {
                        setSelectedStudents([])
                      } else {
                        setSelectedStudents(students.map((s) => s.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Student</TableCell>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Class</TableCell>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Status</TableCell>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Address</TableCell>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Fees</TableCell>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Date</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {students.map((student) => (
                <TableRow
                  key={student.id}
                  className={selectedStudents.includes(student.id) ? "bg-gray-100 dark:bg-white/5" : ""}
                >
                  <TableCell className="px-5 py-4">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <Image
                        src={student.profile}
                        alt={student.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <span className="block font-medium text-theme-sm text-gray-800 dark:text-white/90">
                          {student.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-theme-sm text-gray-500 dark:text-gray-400">
                    {student.className}
                  </TableCell>
                  <TableCell className="text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        student.status === "Present"
                          ? "success"
                          : student.status === "Absent"
                          ? "error"
                          : "warning"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-theme-sm text-gray-500 dark:text-gray-400">
                    {student.address}
                  </TableCell>
                  <TableCell className="text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge size="sm" color={student.feesPaid ? "success" : "error"}>
                      {student.feesPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-theme-sm text-gray-500 dark:text-gray-400">
                    {student.attendanceDate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
