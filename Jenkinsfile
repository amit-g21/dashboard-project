pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                // DOCKER_BUILDKIT=0 helps avoid the 'driver not connecting' error on some setups
                sh 'DOCKER_BUILDKIT=0 docker build -t dashboard-project .'
            }
        }

        stage('Run Container') {
            steps {
                script {
                    // 1. Stop and remove the old container if it exists
                    // The '|| true' ensures the pipeline doesn't fail if the container isn't running yet
                    sh 'docker stop dashboard-container || true'
                    sh 'docker rm dashboard-container || true'
                    
                    // 2. Run the new container with a specific name
                    sh 'docker run -d -p 8080:80 --name dashboard-container dashboard-project'
                }
            }
        }
    }
}