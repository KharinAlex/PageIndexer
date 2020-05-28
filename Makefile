.PHONY: up down shell-server shell-db clean-docker

up:
	docker-compose up -d && docker-compose logs -f backend db

down:
	docker-compose stop

shell-server:
	docker exec -ti indexer_server bash

shell-db:
	docker exec -ti indexer_db bash

clean-docker:
	docker system prune --all --volumes