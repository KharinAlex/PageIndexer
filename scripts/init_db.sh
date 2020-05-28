#!/bin/bash

# echo '\c test_db \\ CREATE TABLE IF NOT EXISTS Pages(id serial PRIMARY KEY, 
# 		title VARCHAR(120), 
# 		uri VARCHAR(255) UNIQUE NOT NULL, 
# 		content TEXT); 
# 	\\ CREATE INDEX IF NOT EXISTS content_search_idx ON pages
#   		USING gin(to_tsvector(title) || to_tsvector(title));' | psql -U $POSTGRES_USER

psql -U $POSTGRES_USER -c "\c test_db" \
-c "CREATE TABLE IF NOT EXISTS Pages(id serial PRIMARY KEY, title VARCHAR(120), uri VARCHAR(255) UNIQUE NOT NULL, content TEXT);" \
-c "CREATE INDEX IF NOT EXISTS content_search_idx ON pages USING gin(to_tsvector('english', title || ' ' || content));"
