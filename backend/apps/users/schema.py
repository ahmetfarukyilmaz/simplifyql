from ninja import Schema


class Register(Schema):
    email: str
    password: str
