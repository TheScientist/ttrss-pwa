pipeline {
    agent any 
    stages {
        stage('Checkout') { 
            steps {
                git 'https://github.com/TheScientist/ttrss-pwa.git'
            }
        }
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