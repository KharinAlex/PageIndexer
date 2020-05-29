from fastapi import APIRouter, Request, Form, status
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse
from urllib.parse import urlparse
from models import Page, OrderType
from utils.parse_utils import parse_url

router = APIRouter()
templates = Jinja2Templates(directory="templates")
order = OrderType.relevance


@router.get("/")
async def root(request: Request):
    return templates.TemplateResponse(
        "root.html",
        {
            "request": request,
            "pages": Page.get_count()
        },
        status_code=200
    )


@router.get("/index")
async def index_get(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request
        },
        status_code=200
    )


@router.post("/index")
async def index_post(request: Request, url: str = Form(..., max_length=255), depth: int = Form(...)):
    parsed_url = urlparse(url)
    err_msg = list()
    if not parsed_url.scheme or not parsed_url.netloc:
        err_msg.append("URL validation error")
    if not depth or depth > 3:
        err_msg.append("Invalid depth value (allowed values 1-3)")

    if err_msg:
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "errMsg": ", ".join(err_msg)
            },
            status_code=status.HTTP_400_BAD_REQUEST
        )
    sources = await parse_url(url, depth)
    try:
        if len(sources) > 1:
            Page.save_many(sources)
        else:
            Page(**sources[0])
    except Exception as error:
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "errMsg": f'{error}'
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "message": "Indexing complete"
            },
            status_code=status.HTTP_201_CREATED
        )


@router.get("/search")
async def search(request: Request, q: str, offset: int = 0):
    try:
        response = Page.find(q, offset, order)
    except Exception as error:
        return templates.TemplateResponse(
            "search.html",
            {
                "request": request,
                "errMsg": f'{error}'
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return templates.TemplateResponse(
        "search.html",
        {
            "request": request,
            "results": response,
        },
        status_code=200
    )


@router.get("/search_change_order")
async def search_change_order(q: str):
    global order
    order = OrderType.relevance if order == OrderType.alphabetical else OrderType.alphabetical
    url = router.url_path_for("search")
    response = RedirectResponse(url=f'{url}?q={q}')
    return response
