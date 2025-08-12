"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"


interface Student {
  id: number
  name: string
  profile: string
  status: "present" | "absent" | null
  remarks: string
  lastUpdated: string
  attendanceDate: string
}

interface Fee {
  id: number
  amount: number
  due_date: string
  fee_type: string
  status: string
  term: string
  student_name: string
  roll_number: number
  class_name: string
}

export default function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [students, setStudents] = useState<Student[]>([])
  const [fees, setFees] = useState<Fee[]>([])
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    leave: 0,
    rate: 0,
  })

  useEffect(() => {
    const fetchAttendanceAndFees = async () => {
      try {



        // Fetch fees data for the same class teacher or school here
        // Assuming your API has getFeesList method
        const feesRes = await api.getFeesList() // Pass proper param
        if (feesRes.status !== 1 || !feesRes.result) {
          toast.error("Failed to fetch fees data.")
          setFees([])
          return
        }
        setFees(feesRes.result)
      } catch (error) {
        console.error(error)
        toast.error("Error fetching data.")
        setAttendanceStats({ total: 0, present: 0, absent: 0, leave: 0, rate: 0 })
        setStudents([])
        setFees([])
      }
    }

    fetchAttendanceAndFees()
  }, [])

  return (
    <div className="space-y-6">

      <div className="overflow-hidden p-8 rounded-xl border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold mb-4">Fees Details</h2>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Roll Number</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Fee Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Term</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.length > 0 ? (
                  fees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell>{fee.student_name}</TableCell>
                      <TableCell>{fee.roll_number}</TableCell>
                      <TableCell>{fee.class_name}</TableCell>
                      <TableCell>{fee.fee_type}</TableCell>
                      <TableCell>{fee.amount}</TableCell>
                      <TableCell>{format(new Date(fee.due_date), "PPP")}</TableCell>
                      <TableCell className="capitalize">{fee.status}</TableCell>
                      <TableCell>{fee.term}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                      No fee records found.
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
