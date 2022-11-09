from django.contrib.auth import get_user_model
from ninja.security import HttpBearer

User = get_user_model()


class AuthBearer(HttpBearer):
    def authenticate(self, request, token):
        try:
            return User.objects.get(auth_token=token)
        except User.DoesNotExist:
            return None
