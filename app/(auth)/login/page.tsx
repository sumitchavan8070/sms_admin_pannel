"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()




// async function login(email: string , password: string) {
//   const url = 'http://172.23.17.194:5050/api/auth/login';

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Login success:', data);
//     return data;

//   } catch (error) {
//     console.error('Login failed:', error);
//   }
// }

// useEffect(() => {
//   login('sxxs','asdasd');
// },[])


  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  console.log("Login submitted with:", email, password)
  setIsLoading(true)

  try {
    const response = await api.login({ email, password })
    toast.success("Login response:", response)

    

    if (response.access_token) {
      api.setToken(response.access_token)
      localStorage.setItem("user", JSON.stringify(response.user))
      toast.success("Login successful!")

      const role = response.user.role?.name?.toLowerCase()
      router.push(`/dashboard/${role || "admin"}`)
    }

  } catch (error) {
    console.error("Login error:", error)
    // toast.error(`Login error: ${error}`)
    // toast.error("Login failed. Please check your credentials.")
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">School Management System</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
   
        </CardContent>
      </Card>
    </div>
  )
}


// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { Checkbox } from "../button/Checkbox";
// import { Input } from "../button/InputField";
// import { Label } from "../button/Label";
// import { Button } from "../button/Button";
// // import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/components/icons";

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);

//   return (
//     <div className="flex flex-col flex-1 lg:w-1/2 w-full center">
//       <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
//         <Link
//           href="/"
//           className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//         >
//           {/* <ChevronLeftIcon /> */}
//           Back to dashboard
//         </Link>
//       </div>

//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         <h1 className="mb-2 font-semibold text-gray-800 dark:text-white sm:text-title-md">
//           Sign In
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Enter your email and password to sign in!
//         </p>

//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 mt-4">
//           {/* Social Buttons */}
//           <button className="flex items-center justify-center gap-3 py-3 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
//             {/* Google SVG */}
//             <svg width="20" height="20" fill="none">
//               {/* paths omitted for brevity */}
//             </svg>
//             Sign in with Google
//           </button>
//           <button className="flex items-center justify-center gap-3 py-3 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
//             {/* X SVG */}
//             <svg width="21" height="20" fill="none">
//               {/* path omitted */}
//             </svg>
//             Sign in with X
//           </button>
//         </div>

//         <div className="relative py-4 sm:py-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-200 dark:border-gray-800" />
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-5 bg-white dark:bg-gray-900 text-gray-400">Or</span>
//           </div>
//         </div>

//         <form className="space-y-6">
//           <div>
//             <Label>Email <span className="text-error-500">*</span></Label>
//             <Input type="email" placeholder="info@gmail.com"  />
//           </div>

//           <div>
//             <Label>Password <span className="text-error-500">*</span></Label>
//             <div className="relative">
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
                
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
//               >
//                 {/* {showPassword ? (
//                 //   <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
//                 // ) : (
//                 //   <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
//                 )} */}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Checkbox checked={isChecked} onChange={setIsChecked} />
//               <span className="text-gray-700 dark:text-gray-400">Keep me logged in</span>
//             </div>
//             <Link href="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
//               Forgot password?
//             </Link>
//           </div>

//           <Button className="w-full" size="sm">
//             Sign in
//           </Button>
//         </form>

//         <p className="mt-5 text-sm text-center text-gray-700 dark:text-gray-400">
//           Don’t have an account?{" "}
//           <Link href="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
