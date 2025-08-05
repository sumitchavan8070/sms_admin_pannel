"use client"

import React, { useState } from "react"
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

const students: Student[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    className: "Grade 10A",
    profile: "/images/user/user-17.jpg",
    status: "Present",
    address: "123 MG Road, Delhi",
    feesPaid: true,
    attendanceDate: "2025-08-05",
  },
  {
    id: 2,
    name: "Isha Mehra",
    className: "Grade 10B",
    profile: "/images/user/user-18.jpg",
    status: "Absent",
    address: "21 Park Street, Mumbai",
    feesPaid: false,
    attendanceDate: "2025-08-05",
  },
  {
    id: 3,
    name: "Rohan Verma",
    className: "Grade 9A",
    profile: "/images/user/user-19.jpg",
    status: "Leave",
    address: "77 Residency Rd, Bangalore",
    feesPaid: true,
    attendanceDate: "2025-08-05",
  },
  {
    id: 4,
    name: "Priya Nair",
    className: "Grade 11B",
    profile: "/images/user/user-20.jpg",
    status: "Present",
    address: "56 Green Lane, Kochi",
    feesPaid: true,
    attendanceDate: "2025-08-05",
  },
]

export default function StudentTable() {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])

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
            {/* Header */}
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

            {/* Body */}
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
