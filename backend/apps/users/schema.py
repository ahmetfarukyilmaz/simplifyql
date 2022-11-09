from uuid import UUID

from ninja import Schema


class Register(Schema):
    email: str
    password: str


class Error(Schema):
    detail: str


class User(Schema):
    id: int
    email: str
    auth_token: UUID
