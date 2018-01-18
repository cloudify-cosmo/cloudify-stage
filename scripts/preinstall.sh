#!/usr/bin/env bash
set -x

if [ ${CIRCLECI:false} == true ]; then
    npm_install_g="sudo npm install -g"
else
    npm_install_g="npm install -g"
fi

for package in "webpack bower gulp grunt-cli"; do
    $npm_install_g $package
done

npm install
bower install
grunt build

pushd semantic
	gulp build
popd

pushd backend
	npm install
popd
