#!/usr/bin/env bash
set -x


if [ -z ${CIRCLE_BUILD_NUM} ]; then
NPM_GLOBAL_INSTALL_PREFIX="sudo"; # Run as sudo in Jenkins
else
NPM_GLOBAL_INSTALL_PREFIX=""; # Run without sudo in CircleCI
fi

${NPM_GLOBAL_INSTALL_PREFIX} npm install webpack -g
${NPM_GLOBAL_INSTALL_PREFIX} npm install bower -g
${NPM_GLOBAL_INSTALL_PREFIX} npm install gulp -g
${NPM_GLOBAL_INSTALL_PREFIX} npm install grunt-cli -g

npm install
bower install
grunt build
cd semantic
gulp build
cd ../backend
npm install