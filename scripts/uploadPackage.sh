#!/usr/bin/env bash

STAGE_PACKAGE=${STAGE_PACKAGE:-stage.tar.gz}
COMMAND="
  tar xzf stage.tar.gz;
  sudo service cloudify-stage stop;
  sudo rsync -ai cloudify-stage /opt;
  sudo chown -R stage_user:stage_group /opt/cloudify-stage;
  cd /opt/cloudify-stage/backend;
  sudo /opt/nodejs/bin/npm run db-migrate;
  sudo service cloudify-stage restart;"

# Ref.: https://stackoverflow.com/questions/59895/get-the-source-directory-of-a-bash-script-from-within-the-script-itself
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# shellcheck disable=SC1090
. "${DIR}"/../node_modules/cloudify-ui-common/scripts/upload-package.sh

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
