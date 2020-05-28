from pydantic import BaseModel
from utils.db_utils import db_create, db_read
import psycopg2


class Page(BaseModel):
    title: str
    uri: str
    content: str

    @staticmethod
    def get_all():
        result = db_read(query="""SELECT title, uri FROM pages""")
        return [{k: v for k, v in zip(["title", "uri"], values)} for values in result]

    @staticmethod
    def search(search_pattern: str):
        query = """
        SELECT ts_headline(title, q), uri 
        FROM pages, plainto_tsquery(%s) AS q
        WHERE to_tsvector(title || ' ' || content) @@ q
        ORDER BY ts_rank(to_tsvector(title || ' ' || content), q) DESC;
        """
        params = search_pattern,
        try:
            result = db_read(query=query, params=params)
        except psycopg2.Error as error:
            raise Exception(f'Unable to select data. Error: {error}')
        return [{k: v for k, v in zip(["title", "uri"], values)} for values in result]

    def save(self):
        query = """
        INSERT INTO pages (title, uri, content) VALUES (%s,%s,%s) 
        ON CONFLICT (uri) DO NOTHING;
        """
        params = (self.title, self.uri, self.content)

        try:
            result = db_create(query=query, params=params)
        except psycopg2.Error as error:
            raise Exception(f'Unable to save entity. Error: {error}')

        return {"rowcount": result}
