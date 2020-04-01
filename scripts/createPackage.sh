#!/usr/bin/env bash
set -x

TMP_DIR=.tmp
STAGE_PACKAGE=stage.tar.gz

rm -Rf ${TMP_DIR} ${STAGE_PACKAGE}
mkdir -p ${TMP_DIR}/cloudify-stage/dist ${TMP_DIR}/cloudify-stage/backend ${TMP_DIR}/cloudify-stage/conf

cp -r dist/** ${TMP_DIR}/cloudify-stage/dist
cp -r backend/** ${TMP_DIR}/cloudify-stage/backend
cp conf/** ${TMP_DIR}/cloudify-stage/conf
rm ${TMP_DIR}/cloudify-stage/conf/me.json*
cp package.json ${TMP_DIR}/cloudify-stage/package.json

( cd ${TMP_DIR} && tar -czf ${STAGE_PACKAGE} cloudify-stage )
cp ${TMP_DIR}/${STAGE_PACKAGE} .
rm -R ${TMP_DIR}
