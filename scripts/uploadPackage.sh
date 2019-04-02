#!/usr/bin/env bash

MANAGER_USER=${MANAGER_USER:-centos}
STAGE_PACKAGE=${STAGE_PACKAGE:-./stage.tar.gz}
COMMON_OPTIONS="-o StrictHostKeyChecking=no"

# Stage package check and download
[ ! -z ${STAGE_PACKAGE_URL} ] \
&& echo "Stage package URL set. Downloading package from '${STAGE_PACKAGE_URL}'..." && curl ${STAGE_PACKAGE_URL} --output ${STAGE_PACKAGE} \
|| echo "Stage package URL not set."
[ -f ${STAGE_PACKAGE} ] \
&& echo "Stage package found." \
|| exit "Stage package - ${STAGE_PACKAGE} - not found."

# SSH key setting
[ ! -z "$SSH_KEY_PATH" ] \
&& echo "SSH_KEY_PATH=$SSH_KEY_PATH" \
|| exit "SSH_KEY_PATH not defined."
[ -f ${SSH_KEY_PATH} ] \
&& echo "SSH key found." \
|| exit "SSH key to Cloudify Manager - '${SSH_KEY_PATH}' - not found."

# Manager IP setting
[ ! -z "$MANAGER_IP" ] \
&& echo "MANAGER_IP=$MANAGER_IP" \
|| exit "MANAGER_IP not defined."

scp -i ${SSH_KEY_PATH} ${COMMON_OPTIONS} ${STAGE_PACKAGE} ${MANAGER_USER}@${MANAGER_IP}:~
ssh -i ${SSH_KEY_PATH} ${COMMON_OPTIONS} ${MANAGER_USER}@${MANAGER_IP} "tar xzf stage.tar.gz; sudo service cloudify-stage stop; sudo rsync -ai cloudify-stage /opt; sudo chown -R stage_user:stage_group /opt/cloudify-stage; sudo service cloudify-stage restart;"
