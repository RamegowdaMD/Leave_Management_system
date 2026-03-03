import jwt 
from datetime import datetime , timedelta
from django.conf import settings

def generate_token(user):
    payload = {
        "user_id" : user.id,
        "email" :user.email,
        "role":user.role,
        "exp": datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
        "iat": datetime.utcnow(),
    }

    return jwt.encode(payload , settings.JWT_SECRET , settings.JWT_ALGORITHM)

def decode_token(token):
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])

