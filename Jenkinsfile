pipeline {
    agent any
    
    // Set the version globally for the whole pipeline
    environment {
        DOCKER_API_VERSION = '1.43'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                // Keep the DOCKER_BUILDKIT=0 as well for compatibility
                sh 'DOCKER_BUILDKIT=0 docker build -t dashboard-project .'
            }
        }

        stage('Run Container') {
            steps {
                script {
                    sh 'docker stop dashboard-container || true'
                    sh 'docker rm dashboard-container || true'
                    sh 'docker run -d -p 8080:80 --name dashboard-container dashboard-project'
                }
            }
        }
    }
}