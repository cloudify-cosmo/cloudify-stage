def upload_artifacts = { from_job ->
    def prefix = "cloudify/${cloudify_ver}/${milestone}-release"
    retry(3){
        build(job: 'dir_prepare/upload_artifacts_to_s3',
              parameters: [
                string(name: 'build_number', value: from_job.getId()),
                string(name: 'from_job', value: from_job.getFullProjectName()),
                string(name: 'bucket', value: 'cloudify-release-eu'),
                string(name: 'bucket_key_prefix', value: prefix)]
        )
    }
}

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

        stage('Upload RPM') {
            steps {
                def job_build = build(job: 'rpms/cloudify-stage', parameters: [
                    string(name: 'tag', value: branch),
                    string(name: 'manager_tag', value:  branch),
                ])
                upload_artifacts(job_build)
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
