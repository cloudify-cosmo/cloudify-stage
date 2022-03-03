CREATE_REQUIRED_DIRECTORY=$(shell test ! -d /var/log/cloudify/stage && sudo mkdir -p /var/log/cloudify/stage && sudo chmod 777 /var/log/cloudify/stage)

install:
	docker-compose up -d postgres-cfy
	@echo $(CREATE_REQUIRED_DIRECTORY)
	cp conf/me.json.template conf/me.json
	sed -i 's/<MANAGER_IP>/127.0.0.1/g' conf/me.json
	npm run beforebuild
	cd backend && npm run db-migrate
	docker-compose stop

install-dev: install
	bash ./scripts/loadLatestPremiumDockerImage.sh

# Run it with command:
# $ make -j2 up
up: docker-up backend-up frontend-up

# Run it with command:
# $ make -j2 up-dev
up-dev: docker-up-dev backend-up frontend-up
docker-up:
	docker-compose --profile prod --profile dev stop && docker-compose --profile prod up -d

docker-up-dev:
	docker-compose --profile prod --profile dev stop && docker-compose --profile dev up -d

backend-up:
	cd backend && npm run devStart

frontend-up:
	npm run devServer

down:
	docker-compose --profile prod --profile dev stop
