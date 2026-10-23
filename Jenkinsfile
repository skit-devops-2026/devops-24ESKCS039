pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('User') {
                    bat 'npm ci'
                }
                dir('admin') {
                    bat 'npm ci'
                }
            }
        }

        stage('Build Applications') {
            steps {
                dir('User') {
                    bat 'npm run build'
                }
                dir('admin') {
                    bat 'npm run build'
                }
            }
        }

        stage('Automated Tests') {
            steps {
                bat 'node tests/basic.test.js'
            }
        }

        stage('Container Image Build') {
            steps {
                echo 'Building Docker container image...'
                bat 'docker build -t elara-app:latest .'
            }
        }

        stage('Validate Kubernetes Manifests') {
            steps {
                echo 'Validating Kubernetes manifests...'
                bat 'kubectl apply --dry-run=client -f k8s/'
            }
        }
    }

    post {
        success {
            echo 'ELARA Jenkins CI/CD Pipeline completed successfully.'
        }
        failure {
            echo 'ELARA Jenkins CI/CD Pipeline failed.'
        }
    }
}
