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
import { api } from "@/lib/api"
import { toast } from "sonner"

interface Student {
  id: number
  name: string
  profile: string
  status: "present" | "absent" | null
  feesPaid: boolean
  attendanceDate: string
}

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getClassStudents()

        if (res.status !== 1 || !Array.isArray(res.result)) {
          toast.error("Failed to fetch students")
          return
        }

        const today = new Date().toISOString().split("T")[0]

        const formatted: Student[] = res.result.map((item: any) => ({
          id: item.student_id,
          name: item.student_name,
          profile: (() => {
            const [first, last] = item.student_name.split(" ")
            const initials = `${first?.[0] || "J"}${last?.[0] || "D"}`.toUpperCase()
            return `https://placehold.co/96x96/6366F1/FFFFFF?text=${initials}`
          })(),
          status: null,
          feesPaid: true,
          attendanceDate: today,
        }))

        setStudents(formatted)
      } catch (error) {
        console.error("Error fetching students:", error)
        toast.error("An error occurred while fetching students")
      }
    }

    fetchData()
  }, [])

  const toggleStatus = (id: number, status: "present" | "absent") => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
            ...s,
            status: s.status === status ? null : status,
          }
          : s
      )
    )
  }

const markAttendance = async () => {
  const today = new Date().toISOString().split("T")[0];

  // Build readable list of attendance payloads
  const attendanceList = students
    .filter((s) => s.status)
    .map((s) => ({
      student_id: s.id,
      date: today,
      status: s.status,
      remarks: "",
    }));

  // Display list in console
  console.table(attendanceList);

  // Display as toast (summarized)
  const readableList = attendanceList
    .map(
      (s) =>
        `ID: ${s.student_id}, Date: ${s.date}, Status: ${s.status}, Remarks: ${s.remarks}`
    )
    .join("\n");

  toast.info(`Submitting Attendance:\n${readableList}`);

  try {
    for (const student of attendanceList) {
      const res = await api.markAttendance(student);

      if (res.status !== 1) {
        toast.error(`Failed for ID ${student.student_id}`);
      }
    }

    toast.success("Attendance marked successfully");
  } catch (error) {
    console.error("Error marking attendance:", error);
    toast.error("An error occurred while marking attendance");
  }
};


  return (
    <>
     <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold">Student Attendance</h2>
        <button
          onClick={markAttendance}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Mark Attendance
        </button>
      </div>
     <div className="overflow-hidden p-8 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
     

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b  border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Student</TableCell>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Present</TableCell>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Absent</TableCell>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Fees</TableCell>
                <TableCell className="font-medium text-gray-500 text-theme-xs">Date</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {students.map((student) => (
                <TableRow key={student.id}>
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

                  {/* Present checkbox */}
                  <TableCell className="text-theme-sm text-gray-500 dark:text-gray-400">
                    <Checkbox
                      checked={student.status === "present"}
                      onChange={() => toggleStatus(student.id, "present")}
                      className="checked:bg-green-600"
                    />
                  </TableCell>

                  {/* Absent checkbox */}
                  <TableCell className="text-theme-sm text-gray-500 dark:text-gray-400">
                    <Checkbox
                      checked={student.status === "absent"}
                      onChange={() => toggleStatus(student.id, "absent")}
                      className="checked:bg-red-600"
                    />
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
    </>
   
  )
}
