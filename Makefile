install:
	docker-compose up -d postgres-cfy
	cp conf/me.json.template conf/me.json
	sed -i 's/<MANAGER_IP>/127.0.0.1/g' conf/me.json
	npm run beforebuild
	cd backend && npm run db-migrate
	docker-compose stop

# Run it with command:
# $ make -j2 up
up: docker-up backend-up frontend-up

docker-up:
	docker-compose up -d

backend-up:
	cd backend && npm run devStart

frontend-up:
	npm run devServer

down:
	docker-compose stop
