from environs import Env

env = Env()
env.read_env()

DEBUG = env.bool("DEBUG", True)
SECRET_KEY = env.str("SECRET_KEY")

POSTGRES_SERVER = env.str("POSTGRES_SERVER")
POSTGRES_USER = env.str("POSTGRES_USER")
POSTGRES_PASSWORD = env.str("POSTGRES_PASSWORD")
POSTGRES_DB = env.str("POSTGRES_DB")
POSTGRES_PORT = env.str("POSTGRES_PORT")
