#!/usr/bin/env bash
set -x

sudo npm install grunt-cli -g

npm install
grunt build
cd ../backend
npm install