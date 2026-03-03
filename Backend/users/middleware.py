from django.http import JsonResponse
from .models import User
from .utils import decode_token


class JWTAuthenticationMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        public_paths = ["/api/auth/login/", "/api/auth/register/"]
        
        if request.path.startswith("/api/") and request.path not in public_paths:

            auth_header = request.headers.get("Authorization")

            if not auth_header:
                return JsonResponse({"error": "Token missing"}, status=401)

            try:
                token = auth_header.split(" ")[1]
                payload = decode_token(token)
                user = User.objects.get(id=payload["user_id"])
                request.user = user
            except:
                return JsonResponse({"error": "Invalid or expired token"}, status=401)

        return self.get_response(request)
