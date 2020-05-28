import os

# DB Settings
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASS = os.environ.get("DB_PASS", "postgres")
DB_NAME = os.environ.get("DB_NAME", "test_db")
DB_HOST = os.environ.get("DB_HOST", "database")

# API Settings
SEARCH_DEPTH = 2
PAGE_LIMIT = 10
FETCH_TIMEOUT = 10
CONNECTIONS_LIMIT = 10
