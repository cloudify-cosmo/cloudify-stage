#!/usr/bin/env bash

MANAGER_USER=centos
STAGE_PACKAGE=./stage.tar.gz

[ -f ${STAGE_PACKAGE} ] && echo "Stage package found." || exit "Stage package - ${STAGE_PACKAGE} - not found."
[ ! -z "$SSH_KEY_PATH" ] && echo "SSH_KEY_PATH=$SSH_KEY_PATH" || exit "SSH_KEY_PATH not defined."
[ -f ${SSH_KEY_PATH} ] && echo "SSH key found." || exit "SSH key to Cloudify Manager - '${SSH_KEY_PATH}' - not found."
[ ! -z "$MANAGER_IP" ] && echo "MANAGER_IP=$MANAGER_IP" || exit "MANAGER_IP not defined."

scp -i ${SSH_KEY_PATH} -o StrictHostKeyChecking=no stage.tar.gz ${MANAGER_USER}@${MANAGER_IP}:~
ssh -i ${SSH_KEY_PATH} -o StrictHostKeyChecking=no ${MANAGER_USER}@${MANAGER_IP} "tar xzf stage.tar.gz; sudo service cloudify-stage stop; sudo rsync -av cloudify-stage /opt; sudo chown -R stage_user:stage_group /opt/cloudify-stage; sudo service cloudify-stage start;"
