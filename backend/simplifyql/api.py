from django.http import HttpResponse
from ninja import NinjaAPI
from ninja.errors import ValidationError as PydanticValidationError
from pydantic.error_wrappers import ValidationError
from sql.api import router as sql_router
from users.api import router as users_router

from simplifyql import config

api = NinjaAPI()

api.add_router("/users/", users_router, tags=["users"])
api.add_router("/sql/", sql_router, tags=["sql"])


@api.exception_handler(exc_class=ValidationError)
@api.exception_handler(exc_class=PydanticValidationError)
def validation_error_handler(request, exc):
    error_message = str(exc) if config.DEBUG else "Validation error"
    return HttpResponse(error_message, status=422)
