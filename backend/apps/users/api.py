from django.contrib.auth import get_user_model
from ninja import Router

from .schema import Error, Register, User

router = Router()
UserModel = get_user_model()


@router.post("/register", response={201: User, 400: Error})
def register(request, payload: Register):
    if UserModel.objects.filter(email=payload.email).exists():
        return 400, Error(detail="Email already exists")
    user = UserModel.objects.create_user(payload.email, payload.password)
    return 201, User(
        id=user.id,
        email=user.email,
        auth_token=user.auth_token,
    )


@router.post("/login", response={200: User, 400: Error})
def login(request, payload: Register):
    user = UserModel.objects.filter(email=payload.email).first()
    if user is None:
        return 400, Error(detail="User not found")
    if user.check_password(payload.password):
        return 200, User(
            id=user.id,
            email=user.email,
            auth_token=user.auth_token,
        )
    return 400, Error(detail="Invalid credentials")
