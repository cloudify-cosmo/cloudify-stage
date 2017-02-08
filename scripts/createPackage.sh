#!/usr/bin/env bash
set -x

mkdir .tmp
# make sure its empty (could exist before)
rm -R .tmp/**

mkdir .tmp/cloudify-stage
mkdir .tmp/cloudify-stage/dist
mkdir .tmp/cloudify-stage/backend
mkdir .tmp/cloudify-stage/conf

cp -r dist/** .tmp/cloudify-stage/dist
cp -r backend/** .tmp/cloudify-stage/backend
cp conf/** .tmp/cloudify-stage/conf
cp scripts/package-template.json .tmp/cloudify-stage
cd .tmp
mv cloudify-stage/package-template.json cloudify-stage/package.json
tar -cvzf stage.tar.gz **
#tar -cvzf stage.tar.gz dist/** backend/** conf/** package.json
cd ..
cp .tmp/stage.tar.gz .
rm -R .tmp/**