#!/bin/bash

docker pull postgres:16

dbname=tasklydb
dbpass=mypassword
dbuser=myuser
dbdb=mydb

docker run \
    --name "$dbname" \
    -e "POSTGRES_PASSWORD=$dbpass" \
    -e "POSTGRES_USER=$dbuser" \
    -e "POSTGRES_DB=$dbdb" \
    -v ./postgres-data:/var/lib/postgresql/data \
    -p 5432:5432 \
    -d postgres:16-alpine


