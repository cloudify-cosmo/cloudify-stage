#!/usr/bin/env bash

MANAGER_IP=$(cat conf/me.json | jq -r .manager.ip)
MANAGER_USER=centos
SSH_KEY_PATH=/c/Users/jni/Documents/Projects/Cloudify/cloudify.key
COMMON_OPTIONS="-o StrictHostKeyChecking=no"

echo "Copying SSH key to Manager host..."
scp -i ${SSH_KEY_PATH} ${COMMON_OPTIONS} ${SSH_KEY_PATH} ${MANAGER_USER}@${MANAGER_IP}:~
ssh -i ${SSH_KEY_PATH} ${COMMON_OPTIONS} ${MANAGER_USER}@${MANAGER_IP} "sudo cp cloudify.key /etc/cloudify; sudo chown cfyuser:cfyuser /etc/cloudify/cloudify.key"

echo "Setting up Manager profile..."
cfy profiles delete ${MANAGER_IP}
cfy profiles use ${MANAGER_IP} -u admin -p admin -t default_tenant

echo "Installing hello-world blueprint..."
cfy blueprints upload cloudify-cosmo/cloudify-hello-world-example -b hello-world -n singlehost-blueprint.yaml
cfy deployments create -b hello-world -i webserver_port=9000 -i agent_private_key_path=//etc/cloudify/cloudify.key -i server_ip=${MANAGER_IP} -i agent_user=centos
cfy executions start -d hello-world install

echo "Installing nodecellar blueprint..."
cfy blueprints upload cloudify-cosmo/cloudify-nodecellar-example -b nodecellar -n simple-blueprint.yaml
cfy deployments create -b nodecellar -i agent_private_key_path=//etc/cloudify/cloudify.key -i host_ip=${MANAGER_IP} -i agent_user=centos
cfy executions start -d nodecellar install

#echo "Installing Cloudify Manager of Managers blueprint..."
#CMOM_DIR_PATH=/c/Users/jni/Documents/Projects/Cloudify/blueprints/cmom
#
#echo "Uploading plugins..."
#cfy plugin upload https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases/download/2.12.0/cloudify_openstack_plugin-2.12.0-py27-none-linux_x86_64-centos-Core.wgn -y https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases/download/2.12.0/plugin.yaml
#cfy plugin upload https://github.com/Cloudify-PS/manager-of-managers/releases/download/v2.0.1/cloudify_manager_of_managers-2.0.1-py27-none-linux_x86_64.wgn -y https://github.com/Cloudify-PS/manager-of-managers/releases/download/v2.0.1/cmom_plugin.yaml
#
#echo "Creating secrets for Cloudify Manager of Managers blueprint..."
#cfy secrets create keystone_username --secret-string jakubn
#cfy secrets create keystone_password --secret-string fCBva5ap
#cfy secrets create keystone_tenant_name --secret-string UI-Team-Tenant
#cfy secrets create keystone_url --secret-string https://rackspace-api.cloudify.co:5000/v3
#cfy secrets create keystone_region --secret-string RegionOne
#
#echo "Downloading Cloudify Manager Install RPM..."
#ssh -i ${SSH_KEY_PATH} ${COMMON_OPTIONS} ${MANAGER_USER}@${MANAGER_IP} "cd /etc/cloudify; sudo curl -O http://repository.cloudifysource.org/cloudify/4.5.5/ga-release/cloudify-manager-install-4.5.5ga.rpm; sudo mv cloudify-manager-install-4.5.5ga.rpm cloudify-manager-install.rpm; sudo chown cfyuser:cfyuser /etc/cloudify/cloudify-manager-install.rpm"
#
#echo "Uploading and deploying cmom (Cloudify Manager of Managers) blueprint..."
#cfy blueprints upload ${CMOM_DIR_PATH}/cmom.zip -b cmom -n blueprint.yaml
#cfy deployments create -i ${CMOM_DIR_PATH}/cmom_inputs.yaml -b cmom
#cfy executions start -d cmom install