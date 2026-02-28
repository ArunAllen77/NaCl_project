pipeline {
    agent any

    environment {
        AWS_REGION      = 'ap-southeast-2'
        ECR_REGISTRY    = '871308866189.dkr.ecr.ap-southeast-2.amazonaws.com'
        ECR_REPO        = 'my-app'
        IMAGE_TAG       = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                // Jenkins automatically checks out your GitHub repo here
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${ECR_REPO}:${IMAGE_TAG} .
                """
            }
        }

        stage('Push to ECR') {
            steps {
                sh """
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_REGISTRY}

                    docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}

                    docker push ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}
                """
            }
        }

    }

    post {
        success {
            echo "Image pushed to ECR successfully: ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}