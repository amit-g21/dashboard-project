pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t dashboard-project .'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 8080:80 dashboard-project'
            }
        }
    }
}
