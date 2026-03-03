"use client"

import Form from "next/form";
import Link from "next/link";
import { login } from '@/app/actions/auth'
import { useState } from "react";

export default function Page() {
  const [error, setError] = useState("");

  async function handleLogin(formData: FormData) {
    try {
      await login(formData);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Manager</h1>
            <p className="text-sm text-gray-600">Sign in to manage your leave requests</p>
          </div>

          <Form action={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input 
                className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition" 
                type="email" 
                name="email" 
                placeholder="Enter your email" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition" 
                type="password" 
                name="password" 
                placeholder="Enter your password" 
                required 
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full h-11 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Sign in
            </button>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href='/register' className="text-black font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}