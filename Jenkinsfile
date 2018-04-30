pipeline {
    agent any 
    stages {
        stage('Build') {
            steps {
                sh 'npm i'
                sh 'ng lint'
                sh 'ng build --prod --aot false'
                sh 'ng e2e'
            }
        }
        stage('Test') {
            steps {
             sh 'ng e2e'
            }
        }
    }
}