"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLeaveDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leaveId = params.id
  const queryClient = useQueryClient()

  const { data: leave, isLoading, error } = useQuery({
    queryKey: ['admin-leave', leaveId],
    queryFn: async () => {
      const res = await fetch(`http://127.0.0.1:8000/api/admindashboard/leaves/${leaveId}/`)
      if (!res.ok) throw new Error('Failed to fetch leave details')
      return res.json()
    }
  })

  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`http://127.0.0.1:8000/api/admindashboard/leaves/${leaveId}/status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Failed to update status')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leave', leaveId] })
      router.push('/admindashboard/leaves')
    }
  })

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">Error loading leave details</div>
  if (!leave) return <div className="p-6">Leave not found</div>

  return (
    <div>
      <Link href="/admindashboard/leaves" className="text-blue-500 mb-4 inline-block">&larr; Back to Leaves</Link>
      
      <h1 className="text-2xl font-bold mb-6">Leave Request Details</h1>
      
      <div className="border rounded-lg p-6 space-y-4">
        <div>
          <label className="font-semibold">Employee:</label>
          <p>{leave.employee_name} ({leave.employee_email})</p>
        </div>
        
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

        {leave.status === 'PENDING' && (
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => updateStatus.mutate('APPROVED')}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
            >
              Approve
            </button>
            <button 
              onClick={() => updateStatus.mutate('REJECTED')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
