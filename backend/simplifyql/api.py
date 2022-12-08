from ninja import NinjaAPI
from sql.api import router as sql_router
from users.api import router as users_router

api = NinjaAPI()

api.add_router("/users/", users_router, tags=["users"])
api.add_router("/sql/", sql_router, tags=["sql"])
