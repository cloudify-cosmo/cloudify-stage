pipeline {
    agent { label 'web-ui' }
    environment {
        BRANCH_NAME="${env.BRANCH_NAME}"
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
        stage('Build') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: BRANCH_NAME]], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'cloudify-stage']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '9f6aca75-ebff-4045-9919-b8ec6b5ccf9d', url: 'https://github.com/cloudify-cosmo/cloudify-stage.git']]])
                dir('cloudify-stage') {
                    sh '''#!/usr/bin/env bash
                        source ${JENKINS_HOME}/.profile
                        nvm install
                    '''
                    sh 'npm run beforebuild'
                    sh 'npm run build'
                }
            }
        }

        stage('Build RPM') {
            steps {
                build(
                    job: 'rpms/cloudify-stage',
                    parameters: [
                        string(name: 'tag', value: env.BRANCH_NAME),
                        string(name: 'manager_tag', value:  env.BRANCH_NAME)
                    ]
                )
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
