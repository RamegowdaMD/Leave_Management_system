"use client"

import { useState } from "react"
import Form from "next/form"
import { applyLeave } from "../../actions/leave"

export default function NewLeavePage() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(formData: FormData) {
    const result = await applyLeave(formData)
    if (result?.error) {
      setError(result.error)
      setSuccess("")
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Leave Request</h1>
      
      <Form action={handleSubmit} className="space-y-6">
        <fieldset className="border rounded-lg p-6 space-y-4">
          <legend className="text-lg font-semibold px-2">Leave Details</legend>
          
          <div>
            <label className="block text-sm font-medium mb-2">Leave Type</label>
            <select name="leave_type" required className="w-full border rounded-md p-2">
              <option value="">Select leave type</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="annual">Annual Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input type="date" name="start_date" required className="w-full border rounded-md p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input type="date" name="end_date" required className="w-full border rounded-md p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reason</label>
            <textarea name="reason" required rows={4} className="w-full border rounded-md p-2" placeholder="Enter reason for leave"></textarea>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button type="submit" className="w-full bg-primary text-primary-foreground rounded-md p-2 font-medium">
            Submit Leave Request
          </button>
        </fieldset>
      </Form>
    </div>
  )
}
