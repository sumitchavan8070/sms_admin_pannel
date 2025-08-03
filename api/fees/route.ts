import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const student_id = searchParams.get("student_id")
    const status = searchParams.get("status")

    let sql = `
      SELECT sf.*, u.first_name, u.last_name, u.email, fc.name as fee_category_name
      FROM student_fees sf
      JOIN users u ON sf.student_id = u.id
      JOIN fee_categories fc ON sf.fee_category_id = fc.id
      WHERE 1=1
    `
    const params: any[] = []

    if (student_id) {
      sql += " AND sf.student_id = ?"
      params.push(student_id)
    }

    if (status) {
      sql += " AND sf.status = ?"
      params.push(status)
    }

    sql += " ORDER BY sf.due_date DESC"

    const fees = await query(sql, params)

    return NextResponse.json({ fees })
  } catch (error) {
    console.error("Get fees error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { student_id, fee_category_id, amount, due_date, academic_year } = await request.json()

    if (!student_id || !fee_category_id || !amount || !due_date) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    const result = (await query(
      "INSERT INTO student_fees (student_id, fee_category_id, amount, due_date, academic_year) VALUES (?, ?, ?, ?, ?)",
      [student_id, fee_category_id, amount, due_date, academic_year || "2024-2025"],
    )) as any

    return NextResponse.json(
      {
        message: "Fee record created successfully",
        feeId: result.insertId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create fee error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
