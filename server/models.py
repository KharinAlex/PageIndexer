from enum import Enum
from pydantic import BaseModel
from utils.db_utils import db_create, db_read, db_count
import psycopg2


class OrderType(Enum):
    relevance = "relevance"
    alphabetical = "alphabetical"


class Page(BaseModel):
    title: str
    uri: str
    content: str

    @staticmethod
    def get_count():
        return db_count()

    @staticmethod
    def find(search_pattern: str, offset: int = 0, order: OrderType = OrderType.relevance):
        query = """
                SELECT ts_headline(title, words, 'StartSel=<font>,StopSel=</font>'), 
                ts_headline(content, words, 'StartSel=<font>,StopSel=</font>,MaxFragments=1,MaxWords=10,MinWords=1'), 
                uri 
                FROM pages, plainto_tsquery(%s) AS words
                WHERE to_tsvector(title || ' ' || content) @@ words
                ORDER BY
                """ + (
                """ts_rank(to_tsvector(title || ' ' || content), words) DESC"""
                if order == OrderType.relevance else """UPPER(title) ASC NULLS LAST"""
                ) + """
                LIMIT 10 OFFSET %s;"""
        try:
            result = db_read(query=query, params=(search_pattern, offset))
        except psycopg2.Error as error:
            raise Exception(f'Unable to select data. Error: {error}')
        return [{k: v for k, v in zip(["title", "content", "uri"], values)} for values in result]

    @staticmethod
    def save_many(items: list):
        query = """
            INSERT INTO pages (title, uri, content) VALUES %s 
            ON CONFLICT (uri) DO NOTHING;
            """
        params = [(item.get("title"), item.get("uri"), item.get("content")) for item in items]
        try:
            db_create(query=query, params=params, many=True)
        except psycopg2.Error as error:
            raise Exception(f'Unable to save entity. Error: {error}')

    def save(self):
        query = """
        INSERT INTO pages (title, uri, content) VALUES (%s,%s,%s) 
        ON CONFLICT (uri) DO NOTHING;
        """
        params = (self.title, self.uri, self.content)

        try:
            db_create(query=query, params=params)
        except psycopg2.Error as error:
            raise Exception(f'Unable to save entity. Error: {error}')

