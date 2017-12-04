#!/usr/bin/env bash
set -x
npm install webpack -g
npm install bower -g
npm install gulp -g
npm install grunt-cli -g
npm install
bower install
grunt build

pushd semantic
	gulp build
popd

pushd backend
	npm install
popd
