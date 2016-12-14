#!/usr/bin/env bash
set -x
rm -R stage
mkdir stage
tar -zxvf stage.tar.gz -C stage
rm stage.tar.gz
cd stage/backend
forever list
forever stopall
forever start server.js;