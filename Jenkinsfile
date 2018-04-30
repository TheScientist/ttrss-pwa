pipeline {
    agent any 
    stages {
        stage('Checkout') { 
            git 'https://github.com/TheScientist/ttrss-pwa.git'
        }
        stage('Build') {
            sh 'npm i'
            sh 'ng lint'
            sh 'ng build --prod --aot false'
            sh 'ng e2e'
        }
        stage('Test') {
            sh 'ng e2e'
        }
    }
}