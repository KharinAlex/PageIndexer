.PHONY: up down shell-client shell-server shell-db clean-docker

up:
	docker-compose up -d && docker-compose logs -f frontend backend db

down:
	docker-compose stop

shell-client:
	docker exec -ti indexer_client bash

shell-server:
	docker exec -ti indexer_server bash

shell-db:
	docker exec -ti indexer_db bash

clean-docker:
	docker system prune --all --volumes