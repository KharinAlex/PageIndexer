# PageIndexer
Simple application for pages indexing and searching.

## Quick Start

Install [Docker](https://www.docker.com/community-edition#/download) and [Docker compose](https://docs.docker.com/compose/install/)

Run Docker

Build and start three containers configured for development work and tail the log output

    make up

The following container instances are started:

* **indexer_client**: React app which interact with server API. Reachable at [http://localhost:8080]().
* **indexer_server**: Web server with server-side rendering. Reachable at [https://localhost:8000]().
* **db**: A Postgres database.

To connect to the database:

    make shell-db

To connect to the React app:

    make shell-client

To connect to the Web server:

    make shell-server

To stop all docker containers:

    make down

To purge all container state, including the database volume:

    make clean-docker
