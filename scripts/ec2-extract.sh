#!/usr/bin/env bash
set -x
forever list
forever stopall
rm -R stage
mkdir stage
tar -zxvf stage.tar.gz
rm stage.tar.gz
cd cloudify-stage/backend
forever start server.js;