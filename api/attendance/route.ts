import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
    const type = searchParams.get("type") || "staff"

    let sql: string
    if (type === "staff") {
      sql = `
        SELECT sa.*, u.first_name, u.last_name, u.email 
        FROM staff_attendance sa
        JOIN users u ON sa.staff_id = u.id
        WHERE sa.date = ?
        ORDER BY u.first_name, u.last_name
      `
    } else {
      sql = `
        SELECT sta.*, u.first_name, u.last_name, u.email, c.name as class_name
        FROM student_attendance sta
        JOIN users u ON sta.student_id = u.id
        JOIN classes c ON sta.class_id = c.id
        WHERE sta.date = ?
        ORDER BY c.name, u.first_name, u.last_name
      `
    }

    const attendance = await query(sql, [date])

    return NextResponse.json({ attendance })
  } catch (error) {
    console.error("Get attendance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, date, status, type, class_id, check_in_time, check_out_time, notes } = await request.json()

    if (!user_id || !date || !status || !type) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    let sql: string
    let params: any[]

    if (type === "staff") {
      sql = `
        INSERT INTO staff_attendance (staff_id, date, status, check_in_time, check_out_time, notes, marked_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        check_in_time = VALUES(check_in_time),
        check_out_time = VALUES(check_out_time),
        notes = VALUES(notes),
        updated_at = CURRENT_TIMESTAMP
      `
      params = [user_id, date, status, check_in_time, check_out_time, notes, 1] // marked_by admin
    } else {
      sql = `
        INSERT INTO student_attendance (student_id, class_id, date, status, notes, marked_by)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        notes = VALUES(notes),
        updated_at = CURRENT_TIMESTAMP
      `
      params = [user_id, class_id, date, status, notes, 1] // marked_by admin
    }

    await query(sql, params)

    return NextResponse.json({
      message: "Attendance marked successfully",
    })
  } catch (error) {
    console.error("Mark attendance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
