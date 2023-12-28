from django.contrib.auth import get_user_model
from ninja import Router

from .schema import ErrorSchema, RegisterSchema, UserSchema

router = Router()
UserModel = get_user_model()


@router.post("/register", response={201: UserSchema, 400: ErrorSchema})
def register(request, payload: RegisterSchema):
    if UserModel.objects.filter(email=payload.email).exists():
        return 400, ErrorSchema(detail="Email already exists")
    user = UserModel.objects.create_user(payload.email, payload.password)
    return 201, UserSchema(
        id=user.id,
        email=user.email,
        auth_token=user.auth_token,
    )


@router.post("/login", response={200: UserSchema, 400: ErrorSchema})
def login(request, payload: RegisterSchema):
    if (user := UserModel.objects.filter(email=payload.email).first()) is None:
        return 400, ErrorSchema(detail="UserSchema not found")
    if user.check_password(payload.password):
        return 200, UserSchema(
            id=user.id,
            email=user.email,
            auth_token=user.auth_token,
        )
    return 400, ErrorSchema(detail="Invalid credentials")
