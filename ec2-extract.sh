#!/usr/bin/env bash
set -x
forever list
forever stopall
rm -R stage
mkdir stage
tar -zxvf stage.tar.gz -C stage
rm stage.tar.gz
cd stage/backend
forever start server.js;