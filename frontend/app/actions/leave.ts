'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function applyLeave(formData: FormData) {
    const cookieStore = await cookies()
    const email = cookieStore.get('user_email')?.value
    
    if (!email) {
        return { error: "User not authenticated" }
    }
    
    const leave_type = formData.get('leave_type')
    const start_date = formData.get('start_date')
    const end_date = formData.get('end_date')
    const reason = formData.get('reason')
    
    try {
        const res = await fetch('http://127.0.0.1:8000/api/leaves/create/', {
            method: 'POST',
            body: JSON.stringify({ email, leave_type, start_date, end_date, reason }),
            headers: { 'Content-Type': 'application/json' }
        })
        
        const data = await res.json()
        
        if (!res.ok) {
            return { error: data.error || "Failed to submit leave request" }
        }
    } catch (error) {
        return { error: "Please try again." }
    }
    
    redirect('/dashboard')
}
