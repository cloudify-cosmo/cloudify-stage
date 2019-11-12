# Test
## Unit tests

There are multiple tests divided by category:
- React components tests in [test/components](./test/components) directory
- Redux reducers tests in [test/reducers](./test/reducers) directory
- Util classes tests in [test/utils](./test/utils) directory

Run `npm run prodtest` to start all unit tests.

Run `npm run devtest -- --test <path_to_spec_file>` to start specific unit test from `<path_to_spec_file>`.

## System tests

There are two types of system tests.

Originally system tests were written using [Nightwatch.js](http://nightwatchjs.org/) testing solution.

All new system tests are written using [Cypress](https://www.cypress.io/) front end testing tool.

### Nightwatch

All of Nightwatch-based tests are stored in [test/nightwatch](./test/nightwatch) directory.
 
#### Running tests with local Selenium server
Run `npm run e2e:old:dev`.

#### Running tests with remote Selenium server
1. Set the following environmental variables:
   ```
   export STAGE_E2E_SELENIUM_HOST=<SELENIUM_HOST_IP_ADDRESS>
   export STAGE_E2E_MANAGER_URL=<MANAGER_IP>
   ```
2. Run: `npm run e2e:old`.

### Cypress

All of Cypress-based tests are stored in [test/cypress](./test/cypress) directory.
 
#### Running tests using test runner
Run `npm run e2e:new:open`.

It opens the Cypress Test Runner in interactive mode. You can pass additional parameters to the script following [cypress open command documentation](https://docs.cypress.io/guides/guides/command-line.html#cypress-open).

#### Running tests in silent mode
Run `npm run e2e:new`.

That command runs Cypress tests to completion. 
By default will run all tests headlessly in the [Electron](https://electronjs.org/) browser. You can pass additional parameters to the script following [cypress run command documentation](https://docs.cypress.io/guides/guides/command-line.html#cypress-run).

