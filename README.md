# Cloudify Console
[![CircleCI](https://circleci.com/gh/cloudify-cosmo/cloudify-stage.svg?style=svg)](https://circleci.com/gh/cloudify-cosmo/cloudify-stage)

## Prerequisites
- NodeJS (version >= 8.x) and npm installed
- PostgreSQL installed and running on your machine
    - Make a database named `stage` 
    - Make a user named `cloudify` with `cloudify` as password
- Cloudify Manager (version => 4.x) running

## Setup

### Configuration
Create the resources needed to connect to the Cloudify Manager:
- create `conf/me.json` file basing on `conf/me.json.template` - provide IP of your Cloudify Manager there
- copy `/opt/cloudify-stage/resources/admin_token` from Cloudify Manager machine to `resources/admin_token` in repo main directory 

### Installation
Install the webserver and database components:
- `npm run beforebuild`
- `cd backend && npm run db-migrate`

## Deployment
You can deploy the stage either by starting the server and connecting to stage locally, or by packaging it and deploying it on a remote server.

### Start the servers locally
Start the stage server backend and the webserver:
- run backend server: `cd backend && npm start`
- run development server: `npm run devServer`

Open browser to see if application is running. It runs by default on `http://localhost:4000`. 

Changes in the source code shall be hot loaded to the development development version of the application. For changes `app` directory you don't need to reload page, for changes in `widgets` directory you need to reload page to see your updates.

### Package stage for remote deployment
Create application package:
- to create production build run: `npm run build`
- to pack all necessary files into archive run: `npm run zip` 

Application package will be in repo main directory. 

## Test
### Unit tests
Run `npm run prodtest`.

### System tests

#### Running in development environment
Run `npm run deve2e`.

#### Running in production environment
Set the following environmental variables:
```
export STAGE_E2E_SELENIUM_HOST=<SELENIUM_HOST_IP_ADDRESS>
export STAGE_E2E_MANAGER_URL=<MANAGER_IP>
```
and run: `npm run e2e`.

## Documentation
To create components documentation run: `npm run doc`.
Documentation is created in `doc/www` directory. Open `doc/www/index.html` in web browser to see it.
