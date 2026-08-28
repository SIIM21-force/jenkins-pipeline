pipeline {
    agent any

    environment {
        IMAGE_NAME = 'simple-web-app'
        CONTAINER_NAME = 'simple-web-app-container'
        APP_PORT = '3000'
    }

    stages {
        stage('Install & Test') {
            steps {
                echo 'Running unit tests...'
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Build Container Image') {
            steps {
                echo 'Building image with Podman...'
                sh "podman build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Deploying container...'
                sh """
                # Stop and remove existing container if running
                podman stop ${CONTAINER_NAME} || true
                podman rm -f ${CONTAINER_NAME} || true
                # Run the new container
                podman run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:3000 ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Health Check') {
            steps {
                echo 'Verifying application health...'
                sh "sleep 3 && curl -f http://localhost:${APP_PORT}/health || exit 1"
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check the logs above."
        }
    }
}
