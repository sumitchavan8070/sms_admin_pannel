import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    let sql = "SELECT id, email, first_name, last_name, role, phone, status, created_at FROM users"
    const params: any[] = []

    if (role) {
      sql += " WHERE role = ?"
      params.push(role)
    }

    sql += " ORDER BY created_at DESC"

    const users = await query(sql, params)

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, first_name, last_name, role, phone } = await request.json()

    if (!email || !password || !first_name || !last_name || !role) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = (await query("SELECT id FROM users WHERE email = ?", [email])) as any[]

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Insert new user
    const result = (await query(
      "INSERT INTO users (email, password, first_name, last_name, role, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, first_name, last_name, role, phone],
    )) as any

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.insertId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
