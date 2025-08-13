"use client"

import { SetStateAction, useEffect, useState } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { Progress } from "@radix-ui/react-progress"
import { CalendarIcon, Calendar, Download, Users, TrendingUp } from "lucide-react"

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

export default function FeesManagement() {
  const [fees, setFees] = useState<Fee[]>([])
  const [filteredFees, setFilteredFees] = useState<Fee[]>([])
  const [loading, setLoading] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [classFilter, setClassFilter] = useState("all")

  // Add/Edit Dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFee, setEditingFee] = useState<Fee | null>(null)
  const [formData, setFormData] = useState<Partial<Fee>>({})

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0,
    overdue: 0,
  })

  useEffect(() => {
    fetchFees()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [fees, search, statusFilter, classFilter])

  const fetchFees = async () => {
    setLoading(true)
    try {
      const res = await api.getFeesList()
      if (res.status === 1 && res.result) {
        setFees(res.result)
        calculateStats(res.result)
      } else {
        toast.error("Failed to fetch fees data.")
        setFees([])
      }
    } catch (error) {
      console.error(error)
      toast.error("Error fetching data.")
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: Fee[]) => {
    const total = data.length
    const paid = data.filter(f => f.status.toLowerCase() === "paid").length
    const unpaid = data.filter(f => f.status.toLowerCase() === "unpaid").length
    const overdue = data.filter(f => f.status.toLowerCase() === "overdue").length
    setStats({ total, paid, unpaid, overdue })
  }

  const applyFilters = () => {
    let filtered = [...fees]

    if (search) {
      filtered = filtered.filter(f =>
        f.student_name.toLowerCase().includes(search.toLowerCase()) ||
        f.class_name.toLowerCase().includes(search.toLowerCase()) ||
        f.fee_type.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(f => f.status.toLowerCase() === statusFilter)
    }

    if (classFilter !== "all") {
      filtered = filtered.filter(f => f.class_name.toLowerCase() === classFilter)
    }

    setFilteredFees(filtered)
  }

  const handleEdit = (fee: Fee) => {
    setEditingFee(fee)
    setFormData(fee)
    setDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingFee(null)
    setFormData({})
    setDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      // if (editingFee) {
      //   // Update API
      //   await api.updateFee(editingFee.id, formData)
      //   toast.success("Fee updated successfully")
      // } else {
      //   // Add API
      //   await api.addFee(formData)
      //   toast.success("Fee added successfully")
      // }
      setDialogOpen(false)
      fetchFees()
    } catch (error) {
      toast.error("Error saving fee data")
    }
  }

  return (
    <div className="space-y-6">
            <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Fees Management</h1>
          <p className="text-muted-foreground">
             Manage students Fees
          </p>
        </div>
        <div className="flex gap-2">
   
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <hr />

      {/* Attendance Stats */}
      <div className="grid gap-4 md:grid-cols-4 pb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid records</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paid}</div>
            {/* <Progress value={20} className="mt-2 h-2" /> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid records</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unpaid}</div>
            <p className="text-xs text-muted-foreground">
              Out of {stats.total} records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-medium">Overdue </CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Out of {stats.total} records
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input placeholder="Search by student, class, or type" value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {[...new Set(fees.map(f => f.class_name))].map(cls => (
              <SelectItem key={cls} value={cls.toLowerCase()}>{cls}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAddNew}>+ Add Fee</Button>
      </div>

      {/* Fees Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Roll</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Term</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">Loading...</TableCell>
              </TableRow>
            ) : filteredFees.length > 0 ? (
              filteredFees.map(fee => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.student_name}</TableCell>
                  <TableCell>{fee.roll_number}</TableCell>
                  <TableCell>{fee.class_name}</TableCell>
                  <TableCell>{fee.fee_type}</TableCell>
                  <TableCell>{fee.amount}</TableCell>
                  <TableCell>{format(new Date(fee.due_date), "PPP")}</TableCell>
                  <TableCell className="capitalize">{fee.status}</TableCell>
                  <TableCell>{fee.term}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(fee)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  No fee records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFee ? "Edit Fee" : "Add Fee"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Student Name" value={formData.student_name || ""} onChange={e => setFormData({ ...formData, student_name: e.target.value })} />
            <Input placeholder="Roll Number" type="number" value={formData.roll_number || ""} onChange={e => setFormData({ ...formData, roll_number: Number(e.target.value) })} />
            <Input placeholder="Class" value={formData.class_name || ""} onChange={e => setFormData({ ...formData, class_name: e.target.value })} />
            <Input placeholder="Fee Type" value={formData.fee_type || ""} onChange={e => setFormData({ ...formData, fee_type: e.target.value })} />
            <Input placeholder="Amount" type="number" value={formData.amount || ""} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} />
            <Input placeholder="Due Date" type="date" value={formData.due_date || ""} onChange={e => setFormData({ ...formData, due_date: e.target.value })} />
            <Select value={formData.status || ""} onValueChange={val => setFormData({ ...formData, status: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Term" value={formData.term || ""} onChange={e => setFormData({ ...formData, term: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
