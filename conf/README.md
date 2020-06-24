# Configuration

The following section describes different configuration files used in cloudify-stage.

## Application (`app.json`)

* `maintenancePollingInterval` - integer, time interval for Cloudify Manager status polling (milliseconds) 
* `singleManager` - boolean, defines if Cloudify Manager is executed as single (depracated)
* `db` - object, Cloudify Stage PostgreSQL DB connection configuration
  * `url` - string, DB URL 
  * `options` - object, DB connection options passed to [Sequelize constructor](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor)
  
* `proxy` - object, configuration of Stage Backend proxy to Cloudify Manager 
  * `timeouts`
    * `get` - integer, GET request timeout (milliseconds)
    * `post` - integer, POST request timeout (milliseconds)
    * `put` - integer, PUT request timeout (milliseconds)
    * `delete` - integer, DELETE request timeout (milliseconds)
    * `blueprintUpload` - integer, blueprint upload request timeout (milliseconds)

* `github` - object, configuration for accessing GitHub resources
  * `username` - string, GitHub username secret name, eg. "secret(github-username)"
  * `password` - string, GitHub password secret name, eg. "secret(github-password)"

* `source` - object, configuration for files handling  
  * `browseSourcesDir` - string, directory name used to store blueprint source files
  * `lookupYamlsDir` - string, directory name used to store YAML files

* `widgets` - object, configuration for widgets handling
  * `ignoreFolders` - array of strings, list of directories to be ignored when importing widgets 
  * `tempDir` - string, directory name used to store widgets temporary files 
  * `requiredFiles` - array of strings, list of filenames required to properly load widget
  * `backendFilename` - string, name of the file containing widget backend inside widget directory

* `ssl` - object, configuration for SSL connection
  * `ca` - string, absolute path to SSL CA certificate
  
* `saml` - object, SAML configuration
  * `enabled` - boolean, if set to true SAML will be enabled
  * `certPath` - string, SAML certificate path
  * `ssoUrl` - string, redirect URL to the application at the Single Sign-On identity provider
  * `portalUrl` - string, redirect URL to the organization portal

## Manager (`manager.json`)

* `ip` - string, Cloudify Manager IP
* `apiVersion` - string, Cloudify Manager REST API version, eg. "v3.1" 
* `protocol` - string, Cloudify REST API protocol type, "http" or "https" 
* `port` - string, Cloudify REST API port number

## User (`userConfig.json`)

This configuration can be overridden by: `/dist/userData/userConfig.json`.

* `maps` - object, LeafletJS map configuration, see [Leaflet-providers preview](http://leaflet-extras.github.io/leaflet-providers/preview/) for allowed Tiles URL templates and Attribution values 
  * `tilesUrlTemplate` - string, template map tiles provider URL, check URL template section at [TileLayer page](https://leafletjs.com/reference-1.5.0.html#tilelayer) for details
  * `attribution` -  string, attribution data to be displayed as small text box on a map,  HTML allowed, it is required by map providers, check [Leaflet-providers preview](https://leaflet-extras.github.io/leaflet-providers/preview/) for examples and requirements from different providers
  * `key` - string, API key to be passed to map tile tiles provider 

* `logLevel` - string, default logging level, allowed strings are defined by [Winston](https://github.com/winstonjs/winston) logger

* `whiteLabel` - object, Cloudify UI white-labelling configuration
  * `pageTitle` - string, page title
  * `logoUrl` - string, relative URL to logo image
  * `mainColor` - string, main color (CSS color) 
  * `productName` - string, product name, used in the page header 
  * `headerTextColor` - string, color of text in page header (CSS color)
  * `showVersionDetails` - boolean, if set to true, then version will be shown in page header 
  * `loginPageHeader` - string, login page header
  * `loginPageHeaderColor` - string, login page header color (CSS color)  
  * `loginPageText` - string, login page text under header
  * `loginPageTextColor` - string, login page text under header color (CSS color) 
  * `sidebarColor` - string, menu sidebar color (CSS color)
  * `sidebarTextColor` - string, menu sidebar text color (CSS color) 
  * `customCssPath` - string, relative path to custom CSS file
  
* `widgets` - object, widget configuration exposed to user
  * `allowedModules` - array of strings, list of modules allowed to be required from widget backend 

## Development (`me.json`)

This file is optional, used only in development environment.

* `app` - object, overrides for Application configuration
* `manager` - object, overrides for Manager configuration
* `e2e` - object, overrides for [NightwatchJS configuration](../test/nightwatch/nightwatch.conf.js)
