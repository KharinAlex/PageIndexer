from fastapi import FastAPI
from routers import api, web

app = FastAPI()
app.include_router(
    api.router,
    prefix="/api",
    tags=["api"],
    responses={404: {"description": "Not found"}},
)
app.include_router(
    web.router,
    tags=["web"],
    responses={404: {"description": "Not found"}},
)
