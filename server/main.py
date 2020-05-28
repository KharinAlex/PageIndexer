from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from urllib.parse import urlparse
from models import Page
from utils.parse_utils import parse_url

app = FastAPI()
templates = Jinja2Templates(directory="templates")


@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("root.html", {"request": request, "message": "Search page"})


@app.get("/index")
async def index_get():
    response = Page.get_all()
    return JSONResponse(status_code=status.HTTP_200_OK if response else status.HTTP_204_NO_CONTENT,
                        content=response)


@app.post("/index")
async def index_post(q: str = None):
    if q:
        parsed_url = urlparse(q)
        if not parsed_url.scheme or not parsed_url.netloc:
            return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST,
                                content={"error": "URI validation error"})
        sources = await parse_url(q)
        count = None
        for item in sources:
            page = Page(**item)
            try:
                count = page.save()
            except Exception:
                pass
        return JSONResponse(status_code=status.HTTP_201_CREATED,
                            content={"count": count})
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST,
                        content={"error": "URI not provided"})


@app.get("/search")
async def search(q: str):
    response = Page.search(q)
    return JSONResponse(status_code=status.HTTP_200_OK if response else status.HTTP_204_NO_CONTENT,
                        content=response)
