# Cloudify Console [![CircleCI](https://circleci.com/gh/cloudify-cosmo/cloudify-stage.svg?style=svg)](https://circleci.com/gh/cloudify-cosmo/cloudify-stage)

The Cloudify Console provides a streamlined experience for managing and analyzing [Cloudify Manager](https://cloudify.co).

![CircleCI](./doc/screenshot.png)


## Prerequisites
- NodeJS (version >= 10.x) and npm installed
- PostgreSQL installed and running on your machine
    - Make a database named `stage` 
    - Make a user named `cloudify` with `cloudify` as password
    - You can do this easily with docker:
        ```bash
        docker pull postgres
        docker run --name postgres-cfy -e POSTGRES_PASSWORD=cloudify -e POSTGRES_USER=cloudify -e POSTGRES_DB=stage -p 5432:5432 -d postgres
        ```
- Cloudify Manager (version => 4.x) running

## Setup

### Configuration
Create `conf/me.json` file basing on `conf/me.json.template` and change `<MANAGER_IP>` into real IP of your Cloudify Manager.

### Installation
Install application dependencies and initialize database:
- `npm run beforebuild`
- `cd backend && npm run db-migrate`

## Deployment
You can deploy the stage either by starting the server and connecting to stage locally, or by packaging it and deploying it on a remote server.

### Local deployment
Start the stage server backend and the webserver:
- run backend server: `cd backend && npm run devStart`
- run development server: `npm run devServer`

Open browser to see if application is running. It runs by default on `http://localhost:4000`. 

Changes in the source code shall be hot loaded to the development version of the application:
- for changes in `app` directory you don't need to reload page, 
- for changes in `widgets` directory you need to reload page to see your updates,
- for changes in `backend` directory you don't need to reload page as backend server will automatically be restarted.

### Remote deployment
- create application package:
    - to create production build run: `npm run build`
    - to pack all necessary files into archive run: `npm run zip`
    Application package will be in repo main directory. 
- upload the package to the remote Cloudify Manager:
    - define path to private SSH key to access Cloudify Manager: `export SSH_KEY_PATH=<PATH>`
    - define Cloudify Manager IP adress: `export MANAGER_IP=<MANAGER_IP>`
    - upload package to the Cloudify Manager and restart UI services: `npm run upload`

## Widgets development

Once you have configured successfully local deployment of Cloudify Console you are able to start development and testing of your own widgets. All out-of-the-box widgets resides in `widgets` directory. 

To create your own widget:
- follow the instructions from [here](https://docs.cloudify.co/latest/developer/custom_console/custom-widgets/) and place widget in `widgets` directory
- restart development server
- install new widget 

Since now, every single change in widget's code should be reflected in webserver after page reload.

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

### Components
To create components documentation run: `npm run doc`.
Documentation is created in `doc/www` directory. Open `doc/www/index.html` in web browser to see it.

### Widgets
Widgets documentation bases on [Cloudify Documentation](https://docs.cloudify.co/latest/working_with/console/default-widgets-ref/) and is stored in README.md files in widgets' folders.

To update widgets' documentation run `npm run docWidgets`. 
Configuration for update script can be found in: `scripts/readmesConfig.json`. 
