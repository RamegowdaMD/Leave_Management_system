"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function AdminLeavesPage() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-leaves', page],
    queryFn: async () => {
      const res = await fetch(`http://127.0.0.1:8000/api/admindashboard/leaves/?page=${page}`)
      if (!res.ok) throw new Error('Failed to fetch leaves')
      return res.json()
    },
    retry: 1
  })

  const updateStatus = useMutation({
    mutationFn: async ({ leaveId, status }: { leaveId: number, status: string }) => {
      const res = await fetch(`http://127.0.0.1:8000/api/admindashboard/leaves/${leaveId}/status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Failed to update status')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leaves'] })
    }
  })

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error.message}</div>

  const leaves = data?.results || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Leave Requests</h1>
      
      {leaves.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No leave requests found</div>
      ) : (
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">End Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave: any) => (
              <tr key={leave.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/admindashboard/leaves/${leave.id}`}>
                <td className="p-3">{leave.employee_name}</td>
                <td className="p-3">{leave.leave_type}</td>
                <td className="p-3">{leave.start_date}</td>
                <td className="p-3">{leave.end_date}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {leave.status}
                  </span>
                </td>
                <td className="p-3">
                  {leave.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus.mutate({ leaveId: leave.id, status: 'APPROVED' });
                        }}
                        className="px-3 py-1 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition font-medium"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus.mutate({ leaveId: leave.id, status: 'REJECTED' });
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  )}
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
