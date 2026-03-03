from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password, make_password
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import User
from .utils import generate_token


class LoginView(APIView):

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        try:
            user = User.objects.get(email=email)
            if not check_password(password, user.password):
                return Response({"error": "Invalid password"}, status=401)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        token = generate_token(user)

        return Response({
            "token": token,
            "role": user.role
        })



class RegisterView(APIView):

    def post(self, request):
        data = request.data

        if not data.get("email") or not data.get("password") or not data.get("username"):
            return Response({"error": "Email, username and password are required"}, status=400)

        if User.objects.filter(email=data["email"]).exists():
            return Response({"error": "Email already exists"}, status=400)
        
        user = User.objects.create(
            username=data["username"],
            email=data["email"],
            password=make_password(data["password"]),
            phone_number=data.get("phone_number"),
            role=data.get("role", "employee"),
        )

        return Response({"message": "User created successfully"}, status=201)
