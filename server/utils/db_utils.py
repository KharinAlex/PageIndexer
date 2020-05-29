import psycopg2
import settings
from contextlib import closing
from psycopg2.extras import execute_values


def get_connection():
    return psycopg2.connect(dbname=settings.DB_NAME, user=settings.DB_USER,
                            password=settings.DB_PASS, host=settings.DB_HOST)


def execute_decorator(func):
    def wrapper(*args, **kwargs):
        connection = get_connection()
        with closing(connection) as connection:
            with connection.cursor() as cursor:
                res = func(connection, cursor, *args, **kwargs)
        return res
    return wrapper


@execute_decorator
def db_create(connection, cursor, query: str, params: tuple = None, many: bool = False):
    execute_values(cursor, query, params) if many else cursor.execute(query, params)
    connection.commit()


@execute_decorator
def db_read(connection, cursor, query: str, params: tuple = None):
    cursor.execute(query, params)
    print(cursor.query)
    return [row for row in cursor]


@execute_decorator
def db_count(connection, cursor):
    cursor.execute("""SELECT COUNT(*) FROM pages;""")
    count = cursor.fetchone()[0]
    return count
