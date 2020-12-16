#!/usr/bin/env bash
set -x

TMP_DIR=.tmp
STAGE_PACKAGE=stage.tar.gz

rm -Rf ${TMP_DIR} ${STAGE_PACKAGE}
mkdir -p ${TMP_DIR}/cloudify-stage/dist ${TMP_DIR}/cloudify-stage/backend ${TMP_DIR}/cloudify-stage/conf

cp -r dist/** ${TMP_DIR}/cloudify-stage/dist
rsync -avrq --exclude='test/' --exclude='package-lock.json' backend ${TMP_DIR}/cloudify-stage
rsync -avrq --exclude='me.json*' --exclude='manager.json' conf ${TMP_DIR}/cloudify-stage
cp package.json ${TMP_DIR}/cloudify-stage/package.json

( cd ${TMP_DIR} && tar -czf ${STAGE_PACKAGE} cloudify-stage )
cp ${TMP_DIR}/${STAGE_PACKAGE} .
rm -R ${TMP_DIR}
