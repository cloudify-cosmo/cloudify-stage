# Cloudify Console 
[![CircleCI](https://circleci.com/gh/cloudify-cosmo/cloudify-stage.svg?style=svg)](https://circleci.com/gh/cloudify-cosmo/cloudify-stage)
[![Cypress.io tests](https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square)](https://cypress.io)

The Cloudify Console provides User Interface for managing and analyzing [Cloudify Manager](https://cloudify.co).

![Cloudify Console screenshot](./doc/screenshot.png)

## Requirements

The following requirements should be met prior starting the application:

- [Node.js](https://nodejs.org) (version >= 10.15.x) installed
- [PostgreSQL](https://www.postgresql.org/) (version >= 9.5.x) installed and configured:
    - Make a database named `stage` 
    - Make a user named `cloudify` with `cloudify` as password
    - You can do this easily with docker:
        ```bash
        docker pull postgres
        docker run --name postgres-cfy -e POSTGRES_PASSWORD=cloudify -e POSTGRES_USER=cloudify -e POSTGRES_DB=stage -p 5432:5432 -d postgres
        ```
- Cloudify Manager (version >= 4.x) accessible from your local machine

## Setup

To setup development environment and start the application follow the steps below.

1. **Configuration**
   
   * Create `conf/me.json` file basing on `conf/me.json.template`.
   * Change `<MANAGER_IP>` into real IP of your Cloudify Manager in that file.

1. **Dependencies installation**

   Run `npm run beforebuild` to install application dependencies.

1. **Database setup**
   
   Run `cd backend && npm run db-migrate` to initialize database.

1. **Application start**

   You can run the application by starting the stage backend server and starting [webpack dev server](https://webpack.js.org/configuration/dev-server/) serving client side:
   * In 'backend' folder, run `npm run devStart` to start backend server (Notice: you will need to have write permissions to `/var/log/cloudify/stage`). For more information and troubleshooting visit [backend](./backend).
   * And also run `npm run devServer` to start webpack dev server.

At this point you should have development environment configured and running. Open [http://localhost:4000](http://localhost:4000) page in your web-browser to see if application is running.

Changes in the source code shall be hot loaded to the development version of the application:
- for changes in [app](./app) directory you don't need to reload page, 
- for changes in [widgets](./widgets) directory you need to reload page to see your updates,
- for changes in [backend](./backend) directory you don't need to reload page as backend server will automatically be restarted.

## Package

You can create application package and deploy it on a remote Cloudify Manager server.

### Package creation

To create application package:  
1. Create production build by running: `npm run build`.
1. Pack all necessary files into archive by running: `npm run zip`. 
1. Application package will be in `stage.tar.gz` file in repository main directory. 

### Package upload

To upload the package to the remote Cloudify Manager:
1. Define path to private SSH key to access Cloudify Manager: `export SSH_KEY_PATH=<PATH>`.
1. Define Cloudify Manager IP adress: `export MANAGER_IP=<MANAGER_IP>`.
1. Upload package to the Cloudify Manager and restart UI services: `npm run upload`.
1. Open browser and go to page `http://<MANAGER_IP>` to see if application is running.

### Package content

Package archive contains the following resources:

* `backend` - Stage Backend - whole [backend](./backend) folder
* `conf` - configuration files (see [Configuration](./conf/README.md) for details)
* `dist` - Stage Frontend - directory created by Webpack according to the [production configuration](./webpack.config-prod.js)
  * `appData` - built-in application data
    * `tours` - built-in tours - whole [tours](./tours) folder
    * `widgets` - built-in widgets
      * `<widget-name>` - every widget has its own folder 
        * `widget.js` - minified widget bundle file (+ brotli-compressed widget and gzip-compressed widget bundles)
        * `widget.js.br` - (optional) brotli-compressed `widget.js`
        * `widget.js.gz` - (optional) gzip-compressed `widget.js`
        * `README.md` - documentation file
        * `widget.png` - widget thumbnail
      * ...
    * `templates` - built-in templates - whole [templates](./templates) folder
      * `pages` - built-in pages - whole [templates/pages](./templates/pages) folder 
  * `static` - static files
    * `images` - image files
    * `fonts` - font files
    * `js` - JavaScript bundles
      * `main.bundle.js` - bundle created from client-side application source code (+ brotli-compressed and gzip-compressed bundle)
      * `main.bundle.js` - brotli-compressed `main.bundle.js`
      * `main.bundle.js` - gzip-compressed `main.bundle.js`
      * `vendor.bundle.js` - bundle created from client-side application external dependencies
      * `vendor.bundle.js.br` - brotli-compressed `vendor.bundle.js`
      * `vendor.bundle.js.gz` - gzip-compressed `vendor.bundle.js`
    * `index.html` - main HTML file (created from [app/index.tmpl.html](./app/index.tmpl.html))
  * `userData` - user application data (empty in clean package)
    * `widgets` - custom widgets (empty in clean package)
    * `templates` - custom templates (empty in clean package)
      * `pages` - custom pages (empty in clean package)


## Tests

Go to [test/README.md](./test/README.md).

## Documentation 

1. Source Code documentation
   * [Frontend](./app/README.md) - client-side of the application
   * [Backend](./backend/README.md) - servers-side of the application
   * [Widgets](./widgets/README.md) - widgets documentation
   
2. Documentation way-of-work
   
   See [this](./doc/README.md) to learn how this project is documented.

