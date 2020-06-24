#!/usr/bin/env bash

MANAGER_IP=${MANAGER_IP:-$(jq -r '.manager.ip' conf/me.json)}
SSH_KEY_PATH=${SSH_KEY_PATH:-~/.ssh/cloudify.key}
STAGE_PACKAGE=${STAGE_PACKAGE:-stage.tar.gz}

PRE_COMMANDS="
  sudo service cloudify-stage stop;"

POST_COMMANDS="
  sudo -u stage_user /usr/bin/npm run db-migrate --prefix /opt/cloudify-stage/backend;
  sudo service cloudify-stage restart;
  sudo -u stage_user /usr/bin/npm run wait-on-server --prefix /opt/cloudify-stage/backend;"

COMMANDS_FOR_RPM="
  ${PRE_COMMANDS}
  sudo yum remove cloudify-stage -y;
  sudo yum install ${STAGE_PACKAGE} -y;
  sudo systemctl daemon-reload;
  ${POST_COMMANDS}"

COMMANDS_FOR_TAR_GZ="
  ${PRE_COMMANDS}
  rm -rf cloudify-stage;
  tar xzf ${STAGE_PACKAGE};
  sudo rm -rf /opt/cloudify-stage/;
  sudo cp -r cloudify-stage /opt/;
  sudo chown -R stage_user:stage_group /opt/cloudify-stage;
  sudo chown -R cfyuser. /opt/cloudify-stage/conf;
  ${POST_COMMANDS}"

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

PACKAGE_MIME_TYPE=$(file --brief --mime-type "${STAGE_PACKAGE}")
if [ "${PACKAGE_MIME_TYPE}" == "application/gzip" ]; then
    uploadPackage "${STAGE_PACKAGE}" "${COMMANDS_FOR_TAR_GZ}"
elif [ "${PACKAGE_MIME_TYPE}" == "application/x-rpm" ]; then
    uploadPackage "${STAGE_PACKAGE}" "${COMMANDS_FOR_RPM}"
else
    echo "ERROR: Stage package - ${STAGE_PACKAGE} - must be either gzipped tar file or RPM package."
    exit 1
fi
