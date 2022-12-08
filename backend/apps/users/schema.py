from uuid import UUID

from ninja import Schema


class RegisterSchema(Schema):
    email: str
    password: str


class ErrorSchema(Schema):
    detail: str


class UserSchema(Schema):
    id: int
    email: str
    auth_token: UUID
