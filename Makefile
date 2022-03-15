CREATE_REQUIRED_DIRECTORY=$(shell test ! -d /var/log/cloudify/stage && sudo mkdir -p /var/log/cloudify/stage && sudo chmod 777 /var/log/cloudify/stage)
CREATE_CONFIG_IF_NOT_EXIST=$(shell test ! -f conf/me.json && cp conf/me.json.template conf/me.json)

install:
	docker-compose up -d postgres-cfy
	@echo $(CREATE_REQUIRED_DIRECTORY)
	@echo $(CREATE_CONFIG_IF_NOT_EXIST)
	cp conf/me.json.template conf/me.json
	sed -i 's/<MANAGER_IP>/127.0.0.1/g' conf/me.json
	npm run beforebuild
	cd backend && npm run db-migrate
	docker-compose stop

install-dev:
	bash ./scripts/loadLatestPremiumDockerImage.sh

# Run it with command:
# $ make -j2 up-public
up-public: docker-up-public backend-up frontend-up

# Run it with command:
# $ make -j2 up-dev
up-dev: docker-up-dev backend-up frontend-up

docker-up-public: 
	docker-compose --profile prod --profile dev stop && docker-compose --profile prod up -d

docker-up-dev:
	docker-compose --profile prod --profile dev stop && docker-compose --profile dev up -d

backend-up:
	cd backend && npm run devStart

frontend-up:
	npm run devServer

down:
	docker-compose --profile prod --profile dev down
