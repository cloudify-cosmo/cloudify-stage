#!/usr/bin/env bash
set -x

mkdir .tmp
# make sure its empty (could exist before)
rm -R .tmp/**

mkdir .tmp/dist
mkdir .tmp/backend
mkdir .tmp/conf

cp dist/** .tmp/dist
cp backend/** .tmp/backend
cp conf/** .tmp/conf
cp scripts/package-template.json .tmp
cd .tmp
mv package-template.json package.json
tar -cvzf stage.tar.gz **
#tar -cvzf stage.tar.gz dist/** backend/** conf/** package.json
cd ..
cp .tmp/stage.tar.gz .
rm -R .tmp/**