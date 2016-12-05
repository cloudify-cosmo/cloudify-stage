#!/usr/bin/env bash
set -x
rm -R stage
mkdir stage
tar -zxvf stage.tar.gz -C stage
rm stage.tar.gz
cd stage
npm install express
npm install request
forever list
forever stopall
forever start backend/server.js;