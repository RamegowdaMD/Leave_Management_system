from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Leave
from users.models import User
from datetime import datetime

class LeavePagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    max_page_size = 100


class LeaveListView(APIView):
    def get(self, request):
        email = request.GET.get('email')
        
        if not email:
            return Response({'error': 'Email parameter required'}, status=400)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        leaves = Leave.objects.filter(employee=user).order_by('applied_at')
        
        if not leaves.exists():
            return Response({'count': 0, 'next': None, 'previous': None, 'results': []}, status=200)
        
        total_count = leaves.count()

        leave_request_numbers = {leave.id: total_count - idx for idx, leave in enumerate(leaves)}
        
        leaves_desc = Leave.objects.filter(employee=user).order_by('-applied_at')
        paginator = LeavePagination()
        paginated_leaves = paginator.paginate_queryset(leaves_desc, request)
        
        data = [{
            'id': leave.id,
            'request_number': leave_request_numbers[leave.id],
            'employee_name': leave.employee.username,
            'employee_email': leave.employee.email,
            'leave_type': leave.leave_type,
            'start_date': leave.start_date,
            'end_date': leave.end_date,
            'duration': (leave.end_date - leave.start_date).days + 1,
            'reason': leave.reason,
            'status': leave.status,
            'applied_at': leave.applied_at
        } for leave in paginated_leaves]
        
        return paginator.get_paginated_response(data)


class LeaveCreateView(APIView):
    def post(self, request):
        email = request.data.get('email')
        leave_type = request.data.get('leave_type')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        reason = request.data.get('reason', '')
        
        if not all([email, leave_type, start_date, end_date]):
            return Response({'error': 'All fields are required'}, status=400)
        
    
        try:
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
            end = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=400)
        
     
        if start > end:
            return Response({'error': 'Start date must be before or equal to end date'}, status=400)
        
        duration = (end - start).days + 1
        if duration > 3:
            return Response({'error': 'Leave duration cannot exceed 3 days'}, status=400)
        
        try:
            employee = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        leave = Leave.objects.create(
            employee=employee,
            leave_type=leave_type.upper(),
            start_date=start,
            end_date=end,
            reason=reason
        )
        
        return Response({
            'message': 'Leave request submitted successfully',
            'leave_id': leave.id
        }, status=201)


class LeaveUpdateStatusView(APIView):
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


class LeaveDetailView(APIView):
    def get(self, request, leave_id):
        email = request.GET.get('email')
        
        if not email:
            return Response({'error': 'Email parameter required'}, status=400)
        
        try:
            leave = Leave.objects.get(id=leave_id, employee__email=email)
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

