from fastapi import APIRouter, Form, status
from fastapi.responses import JSONResponse
from urllib.parse import urlparse
from models import Page, OrderType
from utils.parse_utils import parse_url

router = APIRouter()
order = OrderType.relevance


@router.get("/")
async def root():
    return JSONResponse(status_code=status.HTTP_200_OK,
                        content={"pages": Page.get_count()})


@router.post("/index")
async def index_post(url: str = Form(..., max_length=255), depth: int = Form(...)):
    parsed_url = urlparse(url)
    err_msg = list()
    if not parsed_url.scheme or not parsed_url.netloc:
        err_msg.append("URL validation error")
    if not depth or depth > 3:
        err_msg.append("Invalid depth value (allowed values 1-3)")

    if err_msg:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST,
                            content={"errMsg": "URI validation error"})
    sources = await parse_url(url, depth)
    try:
        if len(sources) > 1:
            Page.save_many(sources)
        else:
            Page(**sources[0])
    except Exception as error:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"errMsg": f'{error}'})

    return JSONResponse(status_code=status.HTTP_201_CREATED)


@router.get("/search")
async def search(q: str, offset: int = 0):
    try:
        response = Page.find(q, offset, order)
    except Exception as error:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"errMsg": f'{error}'})
    return JSONResponse(status_code=status.HTTP_200_OK, content=response)


@router.get("/search_change_order")
async def search_change_order(q: str):
    global order
    order = OrderType.relevance if order == OrderType.alphabetical else OrderType.alphabetical
    return await search(q)
