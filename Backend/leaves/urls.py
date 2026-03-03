from django.urls import path
from .views import LeaveListView, LeaveCreateView, LeaveDetailView

urlpatterns = [
    path('', LeaveListView.as_view(), name='leave-list'),
    path('create/', LeaveCreateView.as_view(), name='leave-create'),
    path('<int:leave_id>/', LeaveDetailView.as_view(), name='leave-detail'),
]
