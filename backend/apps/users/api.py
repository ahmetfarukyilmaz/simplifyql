from django.contrib.auth import get_user_model
from ninja import Router

from .schema import Register

router = Router()
User = get_user_model()


@router.post("/register")
def register(request, payload: Register):
    user = User.objects.create_user(payload.email, payload.password)
    return {
        "id": user.id,
        "email": user.email,
        "auth_token": user.auth_token,
    }


@router.post("/login")
def login(request, payload: Register):
    user = User.objects.filter(email=payload.email).first()
    if user is None:
        return {"detail": "User not found"}
    if user.check_password(payload.password):
        return {
            "id": user.id,
            "email": user.email,
            "auth_token": user.auth_token,
        }
    return {"detail": "Invalid credentials"}
