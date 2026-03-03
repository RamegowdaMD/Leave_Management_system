from django.urls import path
from .views import LoginView, RegisterView


urlpatterns = [
    path('auth/login/', LoginView.as_view()),
    path('auth/register/', RegisterView.as_view()),
]