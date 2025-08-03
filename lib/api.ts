const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    
  console.log(`url ------ ${url}`)
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : Array.isArray(options.headers)
          ? Object.fromEntries(options.headers)
          : (options.headers as Record<string, string>)),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }


  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async getStaffAttendance() {
    
    return this.request("/v1/attendance/get-staff-attendance?staffId=6&date=2025-07-01")
  }



  async getProfile() {
    return this.request("/auth/profile")
  }

  // Users endpoints
  async getUsers() {
    return this.request("/users")
  }

  async createUser(userData: any) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    })
  }

  // Attendance endpoints
  async getAttendance(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ""
    return this.request(`/attendance${queryString}`)
  }

  async markAttendance(attendanceData: any) {
    return this.request("/attendance", {
      method: "POST",
      body: JSON.stringify(attendanceData),
    })
  }

  // Reports endpoints
  async getDashboardStats() {
    return this.request("/reports/dashboard-stats")
  }

  async getAttendanceReport(params: any) {
    const queryString = new URLSearchParams(params)
    return this.request(`/reports/attendance?${queryString}`)
  }

  // Schools endpoints
  async getSchools() {
    return this.request("/schools")
  }

  async createSchool(schoolData: any) {
    return this.request("/schools", {
      method: "POST",
      body: JSON.stringify(schoolData),
    })
  }
}

export const api = new ApiClient()
