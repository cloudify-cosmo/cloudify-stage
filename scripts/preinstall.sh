#!/usr/bin/env bash
set -x

sudo npm install gulp -g
sudo npm install grunt-cli -g

npm install
grunt build
cd semantic
gulp build
cd ../backend
npm install