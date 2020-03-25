pipeline {
    agent { label 'web-ui' }
    parameters {
        choice(choices: "v12.16.1\nv10.14.0", description: 'NodeJS Version', name: 'NODEJS_VERSION')
    }
    environment {
        BRANCH_NAME="${env.BRANCH_NAME}"
        JENKINS_HOME="${env.JENKINS_HOME}"
    }

    stages {

        stage('BRANCH_NAME') {
            steps{
                sh 'echo BRANCH_NAME = ${BRANCH_NAME}'
            }
        }
        stage('Clean') {
            steps {
                sh 'sudo chown jenkins:jenkins -R ../*'
                step([$class: 'WsCleanup'])
            }
        }
        stage('Set NodeJS Version') {
            steps {
                sh '''#!/usr/bin/env bash
                    source ${JENKINS_HOME}/.profile
                    nvm use ${NODEJS_VERSION}
                '''
            }
        }

        stage('Build') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: BRANCH_NAME]], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'cloudify-stage']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '9f6aca75-ebff-4045-9919-b8ec6b5ccf9d', url: 'https://github.com/cloudify-cosmo/cloudify-stage.git']]])
                dir('cloudify-stage') {
                    sh 'npm run beforebuild'
                    sh 'npm run build'
                }
            }
        }

        stage('Pack') {
            steps {
                dir('cloudify-stage') {
                    sh 'npm run zip'
                }
                sh '''#!/bin/bash
                      first=$(echo $BRANCH_NAME | cut -d. -f1)
                      if [[ $first =~ ^[0-9]+$ ]] && [[ "$first" -gt 17 ]] || [[ "$first" -eq 17 ]] ; then REPO="cloudify-versions" ; else REPO="cloudify-premium" ; fi
                      . ${JENKINS_HOME}/jobs/credentials.sh > /dev/null 2>&1
                      echo "#BRANCH_NAME=$BRANCH_NAME"
                      echo "#first=$first"
                      if [[ $first =~ ^[0-9]+$ ]] || [[ "${BRANCH_NAME}" == "master" ]];then echo "# build branch and master";BRANCH="${BRANCH_NAME}";export BRANCH_S3_FOLDER="";else echo "# dev branches";BRANCH="master";export BRANCH_S3_FOLDER="/${BRANCH_NAME}";fi
                      curl -u $GITHUB_USERNAME:$GITHUB_TOKEN https://raw.githubusercontent.com/cloudify-cosmo/${REPO}/${BRANCH}/packages-urls/common_build_env.sh -o ./common_build_env.sh
                      . $PWD/common_build_env.sh
                      printenv > env.txt
                      mv cloudify-stage/stage.tar.gz  cloudify-stage-$VERSION-$PRERELEASE.tgz'''

            }
        }

        stage('Upload package to S3') {
            steps {

                sh '''#!/bin/bash
                      . $PWD/env.txt
                      s3cmd put --access_key=${AWS_ACCESS_KEY_ID} --secret_key=${AWS_ACCESS_KEY} --human-readable-sizes --acl-public \\
                      cloudify-stage-$VERSION-$PRERELEASE.tgz \\
                      s3://$AWS_S3_BUCKET/$AWS_S3_PATH$BRANCH_S3_FOLDER/'''
            }
        }
    }

    post {
        always {
          sh 'sudo chown jenkins:jenkins -R ../*'
          step([$class: 'Mailer',
            notifyEveryUnstableBuild: true,
            recipients: emailextrecipients([[$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider']]),
            sendToIndividuals: true])
        }
      }

      // The options directive is for configuration that applies to the whole job.
      options {
        buildDiscarder(logRotator(numToKeepStr:'30'))
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
      }
}
