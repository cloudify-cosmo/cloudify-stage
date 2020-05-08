#!/usr/bin/env bash
set -xo pipefail

npm run --silent e2e:old
npm run --silent e2e:new
