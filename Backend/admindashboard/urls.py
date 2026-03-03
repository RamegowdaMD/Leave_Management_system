from django.urls import path
from .views import AdminLeaveListView, AdminLeaveUpdateStatusView, AdminLeaveDetailView

urlpatterns = [
    path('leaves/', AdminLeaveListView.as_view(), name='admin-leave-list'),
    path('leaves/<int:leave_id>/', AdminLeaveDetailView.as_view(), name='admin-leave-detail'),
    path('leaves/<int:leave_id>/status/', AdminLeaveUpdateStatusView.as_view(), name='admin-leave-update-status'),
]
