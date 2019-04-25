# Backend

![Backend architecture](./../doc/diagrams/architecture-backend.png)

## Running

In production stage backend server is started on all vCPUs using [PM2 Runtime](https://pm2.io/runtime/) tool by `npm run start` script.

For a development puropses you can start backend in different modes using the following scripts:
* `npm run devStart` - multi-instance development mode
* `npm run prodStart` - multi-instance production mode in local environment - without Nginx web-server (it requires application build in `dist` folder to be in place - run `npm run build` in main folder to create it)
* `npm run devTrace` - single-instance development mode with stack traces for process warnings 
* `npm run devDebug` - single-instance development mode with inspector started (see [Debugging guide](https://nodejs.org/en/docs/guides/debugging-getting-started/) for details)
