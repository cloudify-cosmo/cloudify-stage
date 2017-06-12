#!/bin/bash -e

echo "### JENKINS_HOME = ${JENKINS_HOME}"
source ${JENKINS_HOME}/jobs/credentials.sh > /dev/null 2>&1


pushd cloudify-system-tests
    export OS_USERNAME=$RACKSPACE_SYSTEM_TESTS_PREMIUM_OS_USERNAME
    export OS_PASSWORD=$RACKSPACE_SYSTEM_TESTS_PREMIUM_OS_PASSWORD

    echo "Creating virtualenv.."
    virtualenv-2.7 venv
    source venv/bin/activate
    echo "Installaing cloudify-system-tests and dependencies.."
    pip install -e .
    pip install -r test-requirements.txt


    echo "Bootstrapping manager... "
    cfy-systests bootstrap

    echo "Manager bootstrapped"

    #checking data
    ls -l
    cd .cfy-systests
    ls -l
    cd ..

    echo "Destroying bootstrapped manager..."
    cfy-systests destroy

	deactivate

popd