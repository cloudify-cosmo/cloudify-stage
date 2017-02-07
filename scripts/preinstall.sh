#!/usr/bin/env bash
set -x
npm install webpack -g
npm install bower -g
npm install gulp -g
npm install grunt-cli -g
bower install
grunt build
cd semantic
gulp build
cd ../backend
npm install