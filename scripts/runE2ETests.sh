#!/usr/bin/env bash

echo "Starting E2E tests..."

echo "Starting Nightwatch tests..."
npm run --silent e2e:old
NIGHTWATCH_TESTS_EXIT_CODE=$?
echo "Finished Nightwatch tests."

echo "Starting Cypress tests..."
npm run --silent e2e:new
CYPRESS_TESTS_EXIT_CODE=$?
echo "Finished Cypress tests."

if [[ $NIGHTWATCH_TESTS_EXIT_CODE -eq 0 ]] && [[ CYPRESS_TESTS_EXIT_CODE -eq 0 ]];
then
  echo "All E2E tests passed successfully."
  exit 0
else
  echo "Some E2E tests failed."
  exit 1
fi
