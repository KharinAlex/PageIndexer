import psycopg2
import settings
from contextlib import closing


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
def db_create(connection, cursor, query: str, params: tuple = None):
    cursor.execute(query, params)
    connection.commit()
    return cursor.rowcount()


@execute_decorator
def db_read(connection, cursor, query: str, params: tuple = None):
    cursor.execute(query, params)
    return [row for row in cursor]
