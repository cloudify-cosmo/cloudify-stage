#!/usr/bin/env bash
set -x
sudo npm install webpack -g
sudo npm install bower -g
sudo npm install gulp -g
sudo npm install grunt-cli -g
npm install
bower install
grunt build
cd semantic
gulp build
cd ../backend
npm install