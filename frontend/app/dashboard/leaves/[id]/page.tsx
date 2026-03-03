"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getUserEmail } from "../../../actions/user"

export default function LeaveDetailPage() {
  const params = useParams()
  const leaveId = params.id
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    getUserEmail().then(setEmail)
  }, [])

  const { data: leave, isLoading, error } = useQuery({
    queryKey: ['leave', leaveId, email],
    queryFn: async () => {
      if (!email) throw new Error('Not authenticated')
      const res = await fetch(`http://127.0.0.1:8000/api/leaves/${leaveId}/?email=${email}`)
      if (!res.ok) throw new Error('Failed to fetch leave details')
      return res.json()
    },
    enabled: !!email
  })

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">Error loading leave details</div>
  if (!leave) return <div className="p-6">Leave not found</div>

  return (
    <div>
      <Link href="/dashboard/leaves" className="text-blue-500 mb-4 inline-block">&larr; Back to Leaves</Link>
      
      <h1 className="text-2xl font-bold mb-6">Leave Request #{leave.id}</h1>
      
      <div className="border rounded-lg p-6 space-y-4">
        <div>
          <label className="font-semibold">Leave Type:</label>
          <p>{leave.leave_type}</p>
        </div>
        
        <div>
          <label className="font-semibold">Start Date:</label>
          <p>{leave.start_date}</p>
        </div>
        
        <div>
          <label className="font-semibold">End Date:</label>
          <p>{leave.end_date}</p>
        </div>
        
        <div>
          <label className="font-semibold">Duration:</label>
          <p>{leave.duration} day(s)</p>
        </div>
        
        <div>
          <label className="font-semibold">Reason:</label>
          <p>{leave.reason || 'N/A'}</p>
        </div>
        
        <div>
          <label className="font-semibold">Status:</label>
          <p>
            <span className={`px-2 py-1 rounded text-sm ${
              leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
              leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {leave.status}
            </span>
          </p>
        </div>
        
        <div>
          <label className="font-semibold">Applied At:</label>
          <p>{new Date(leave.applied_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
