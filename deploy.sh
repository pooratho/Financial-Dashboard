#!/bin/bash
set -e

PROJECT_DIR="/home/roya/team1"
BACKUP_DIR="$PROJECT_DIR/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

cd $PROJECT_DIR

mkdir -p $BACKUP_DIR

if [ "$(docker ps -q -f name=db-container)" ]; then
    docker exec db-container pg_dump -U team1_user team1_db > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
fi

git pull origin main || git pull origin master

docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

docker image prune -f
