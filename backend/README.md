# Backend

![Backend architecture](./../doc/diagrams/architecture-backend.png)

## Starting

### Production

In production stage backend server is started by `npm run start` script. 

### Development

For a development puropses you can start backend in different modes using the following scripts:
* `npm run devStart` - single-instance development mode
* `npm run devTrace` - single-instance development mode with stack traces for process warnings 
* `npm run devDebug` - single-instance development mode with inspector started (see [Debugging guide](https://nodejs.org/en/docs/guides/debugging-getting-started/) for details)

## Troubleshooting
* In case of `npm run devStart` fails to run, please verify first that there are write permissions to `/var/log/cloudify/stage`.
