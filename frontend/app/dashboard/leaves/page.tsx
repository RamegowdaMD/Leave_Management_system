"use client"

import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { getUserEmail } from "../../actions/user"

export default function LeavesPage() {
  const [page, setPage] = useState(1)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    getUserEmail().then(setEmail)
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaves', page, email],
    queryFn: async () => {
      if (!email) throw new Error('Not authenticated')
      const res = await fetch(`http://127.0.0.1:8000/api/leaves/?page=${page}&email=${email}`)
      if (!res.ok) throw new Error('Failed to fetch leaves')
      return res.json()
    },
    enabled: !!email,
    retry: 1
  })

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error.message}</div>

  const leaves = data?.results || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leave Requests</h1>
      
      {leaves.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No leave requests found</div>
      ) : (
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Request #</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">End Date</th>
              <th className="p-3 text-left">Duration</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave: any) => (
              <tr key={leave.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/dashboard/leaves/${leave.id}`}>
                <td className="p-3">#{leave.request_number}</td>
                <td className="p-3">{leave.leave_type}</td>
                <td className="p-3">{leave.start_date}</td>
                <td className="p-3">{leave.end_date}</td>
                <td className="p-3">{leave.duration} day(s)</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={!data?.next}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
