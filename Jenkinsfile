pipeline {
    agent { label 'web-ui' }
    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'master', description: 'Branch name')
    }
    
    stages {
        
        stage('BRANCH_NAME') {
            steps{
                sh 'echo BRANCH_NAME = ${BRANCH_NAME}'
            }
        }
        stage('Clean') {
            steps {
                sh '''#npm cache clean --force
                  #bower cache clean
                  sudo chown jenkins:jenkins -R ../*'''
                //step([$class: 'WsCleanup'])
            }
        }

        //stage('Build') {
        //    steps {
        //        checkout([$class: 'GitSCM', branches: [[name: BRANCH_NAME]], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'cloudify-stage']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '9f6aca75-ebff-4045-9919-b8ec6b5ccf9d', url: 'https://github.com/cloudify-cosmo/cloudify-stage.git']]])
        //        dir('cloudify-stage') {
        //            sh 'npm run beforebuild'
        //            sh 'npm run build'
        //            sh 'sudo chown jenkins:jenkins -R .'
        //        }
        //    }
        //}

        stage('Pack') {
            steps {
                //dir('cloudify-stage') {
                //    sh 'sudo npm run zip'
                //}
                sh '''first=$(echo $BRANCH_NAME | cut -d. -f1)
                      if [[ $first =~ ^[0-9]+$ ]] && [[ "$first" -gt 17 ]] || [[ "$first" -eq 17 ]] ; then REPO="cloudify-versions" ; else REPO="cloudify-premium" ; fi
                      . ${JENKINS_HOME}/jobs/credentials.sh > /dev/null 2>&1
                      if ! [[ $first =~ ^[0-9]+$ ]] && [[ "${BRANCH_NAME}" != "master"  ]];then
                        BRANCH="${BRANCH_NAME}"
                      else
                        BRANCH="master"
                      fi
                      curl -u $GITHUB_USERNAME:$GITHUB_PASSWORD https://raw.githubusercontent.com/cloudify-cosmo/${REPO}/${BRANCH}/packages-urls/common_build_env.sh -o ./common_build_env.sh
                      . $PWD/common_build_env.sh
                      echo "##printenv 1"
                      printenv > env.txt
                      #mv cloudify-stage/stage.tar.gz  cloudify-stage-$VERSION-$PRERELEASE.tgz'''

            }
        }

        stage('Upload package to S3') {
            steps {
               
                sh '''ENV=`cat env.txt`
                      for i in $ENV; do 
                        echo $i 
                      done
                      . $PWD/env.txt
                      echo "##printenv 2"
                      printenv
                      s3cmd put --access_key=${AWS_ACCESS_KEY_ID} --secret_key=${AWS_ACCESS_KEY} --human-readable-sizes --acl-public \\
                      cloudify-stage-$VERSION-$PRERELEASE.tgz \\
                      s3://$AWS_S3_BUCKET/$AWS_S3_PATH$BRANCH_S3_FOLDER/'''
            }
      
        }
    }
    

    post {
        always {
          sh 'sudo chown jenkins:jenkins -R ../*'
          //deleteDir()
        }
        failure {
          mail(from: "jenkins-master-on-aws@gigaspaces.com",
               to: "limor@cloudify.co,jakub.niezgoda@cloudify.co,edenp@cloudify.co",
               subject: "UI build failed!",
               body: "For more information see the build log.")
          //emailext attachLog: true, body: 'For more information see the build log.', recipientProviders: [[$class: 'FirstFailingBuildSuspectsRecipientProvider'], [$class: 'DevelopersRecipientProvider']], subject: 'UI build failed!', to: 'kinneret@gigaspaces.com,limor@gigaspaces.com'
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
