# Test
## Unit tests

There are multiple tests divided by category:
- React components tests in [test/jest/components](./test/jest/components) directory
- Redux reducers tests in [test/jest/reducers](./test/jest/reducers) directory
- Util classes tests in [test/jest/utils](./test/jest/utils) directory
- Widgets tests in [test/jest/widgets](./test/jest/widgets) directory

Run `npm run prodtest` to start all unit tests.

Run `npm run devtest -- <path_to_spec_file>` to start specific unit test from `<path_to_spec_file>`.

## System tests

All system tests are written using [Cypress](https://www.cypress.io/) front end testing tool. They are stored in [test/cypress](./test/cypress) directory.
 
### Running tests using test runner
Run `npm run e2e:open`.

It opens the Cypress Test Runner in the interactive mode. You can pass additional parameters to the script following [cypress open command documentation](https://docs.cypress.io/guides/guides/command-line.html#cypress-open).

### Running tests in silent mode
Run `npm run e2e`.

That command runs Cypress tests to completion. 
By default, will run all tests headlessly in the [Electron](https://electronjs.org/) browser. You can pass additional parameters to the script following [cypress run command documentation](https://docs.cypress.io/guides/guides/command-line.html#cypress-run).

## Other tests

### Bundle size checks

After building application (`npm run build`) you can its size by running `npm run size` command.

To get more detailed information about JS bundles sizes, you can use `npm run build:analyse:<area>` scripts, see [package.json](../package.json) file for the list of available scripts. 
