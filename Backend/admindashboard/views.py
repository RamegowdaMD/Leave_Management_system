from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from leaves.models import Leave


class LeavePagination(PageNumberPagination):
    page_size = 4
    page_size_query_param = 'page_size'
    max_page_size = 100


class AdminLeaveListView(APIView):
    def get(self, request):
        leaves = Leave.objects.all().order_by('-applied_at')
        
        if not leaves.exists():
            return Response({'count': 0, 'next': None, 'previous': None, 'results': []}, status=200)
        
        paginator = LeavePagination()
        paginated_leaves = paginator.paginate_queryset(leaves, request)
    
        data = [{
            'id': leave.id,
            'employee_name': leave.employee.username,
            'employee_email': leave.employee.email,
            'leave_type': leave.leave_type,
            'start_date': leave.start_date,
            'end_date': leave.end_date,
            'reason': leave.reason,
            'status': leave.status,
            'applied_at': leave.applied_at
        } for leave in paginated_leaves]
        
        return paginator.get_paginated_response(data)


class AdminLeaveUpdateStatusView(APIView):
    def patch(self, request, leave_id):
        status = request.data.get('status')
        
        if status not in ['APPROVED', 'REJECTED']:
            return Response({'error': 'Invalid status'}, status=400)
        
        try:
            leave = Leave.objects.get(id=leave_id)
            leave.status = status
            leave.save()
            return Response({'message': f'Leave {status.lower()}'})
        except Leave.DoesNotExist:
            return Response({'error': 'Leave not found'}, status=404)


class AdminLeaveDetailView(APIView):
    def get(self, request, leave_id):
        try:
            leave = Leave.objects.get(id=leave_id)
            data = {
                'id': leave.id,
                'employee_name': leave.employee.username,
                'employee_email': leave.employee.email,
                'leave_type': leave.leave_type,
                'start_date': leave.start_date,
                'end_date': leave.end_date,
                'duration': (leave.end_date - leave.start_date).days + 1,
                'reason': leave.reason,
                'status': leave.status,
                'applied_at': leave.applied_at
            }
            return Response(data)
        except Leave.DoesNotExist:
            return Response({'error': 'Leave not found'}, status=404)


