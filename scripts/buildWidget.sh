#!/usr/bin/env bash

WIDGET_NAME=$1
bestzip --version > /dev/null || npm install -g bestzip
npm run build -- --env widget=$WIDGET_NAME && cd dist/widgets && bestzip ../$WIDGET_NAME.zip $WIDGET_NAME
