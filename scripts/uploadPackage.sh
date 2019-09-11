#!/usr/bin/env bash

STAGE_PACKAGE=${STAGE_PACKAGE:-stage.tar.gz}
COMMAND="
  tar xzf stage.tar.gz;
  sudo service cloudify-stage stop;
  sudo rsync -ai cloudify-stage /opt;
  sudo chown -R stage_user:stage_group /opt/cloudify-stage;
  cd /opt/cloudify-stage/backend;
  sudo /opt/nodejs/bin/npm run db-migrate;
  sudo service cloudify-stage restart;
  sudo /opt/nodejs/bin/npm run wait-on-server;"

NODE_MODULES_PATH="$( npm root )"
UPLOAD_PACKAGE_SCRIPT_PATH="${NODE_MODULES_PATH}/cloudify-ui-common/scripts/upload-package.sh"

if [ ! -f "${UPLOAD_PACKAGE_SCRIPT_PATH}" ]; then
    echo "ERROR: Cloudify UI Common upload-package.sh script not found."
    exit 1
fi
. "$UPLOAD_PACKAGE_SCRIPT_PATH"

# Stage package check and download
if [ -n "${STAGE_PACKAGE_URL}" ]; then
    echo "Stage package URL set. Downloading package from '${STAGE_PACKAGE_URL}'..."
    curl "${STAGE_PACKAGE_URL}" --output "${STAGE_PACKAGE}"
fi
if [ ! -f "${STAGE_PACKAGE}" ]; then
    echo "ERROR: Stage package - ${STAGE_PACKAGE} - not found."
    exit 1
fi

uploadPackage "${STAGE_PACKAGE}" "${COMMAND}"
