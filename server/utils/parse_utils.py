from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
from bs4.element import Tag
from bloom_filter import BloomFilter
from settings import SEARCH_DEPTH, FETCH_TIMEOUT, CONNECTIONS_LIMIT
import asyncio
import aiohttp
import async_timeout

visited = BloomFilter(max_elements=1000, error_rate=0.1)
parsed_pages = list()
semaphore = asyncio.Semaphore(CONNECTIONS_LIMIT)


async def fetch(url: str, session: aiohttp.ClientSession):
    async with semaphore:
        with async_timeout.timeout(FETCH_TIMEOUT):
            async with session.get(url) as response:
                if response.status == 200:
                    return await response.text()
                return ""


def prepare_href(base_url, tag):
    if type(tag) == Tag and tag.has_attr('href'):
        href = tag['href'].split("#")[0]
        if not urlparse(href).netloc:
            href = urljoin(base_url, href)
        return href


def check_link(link) -> bool:
    if link and link not in visited:
        visited.add(link)
        return True
    return False


async def parse_related(url: str, session: aiohttp.ClientSession, depth: int = SEARCH_DEPTH):
    global parsed_pages

    try:
        data = await fetch(url, session)
    except Exception:
        return

    soup = BeautifulSoup(data, features="html.parser")
    title = soup.title
    text = soup.text

    if not title or not text:
        return

    parsed_pages.append({
        "title": title.string,
        "uri": url,
        "content": text.replace("\n", " ").replace("\r", " ")
    })
    print(url)
    if (depth - 1) > 0:
        links = [prepare_href(url, link) for link in soup.find_all('a', href=True)]
        tasks = [parse_url(link, depth - 1)
                 for link in list(filter(check_link, links))]
        await asyncio.gather(*tasks)


async def parse_url(url: str, depth: int = SEARCH_DEPTH) -> list:
    global parsed_pages
    parsed_pages.clear()
    async with aiohttp.ClientSession() as session:
        await parse_related(url, session, depth)
    return parsed_pages
