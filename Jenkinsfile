pipeline {
    agent any

    environment {
        S3_BUCKET = credentials('S3_BUCKET_NAME')
        DISTRIBUTION_ID = credentials('CLOUDFRONT_DISTRIBUTION_ID')
        REGION = 'ap-northeast-2'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/KTB-7/pinpung-frontend.git'
            }
        }
        stage('Clean npm cache and node_modules') {
            steps {
                sh 'npm cache clean --force'
                sh 'rm -rf node_modules'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Fetch Environment Variables from Parameter Store') {
            steps {
                script {
                    def kakaoKey = sh(
                        script: "aws ssm get-parameter --name '/pinpung/REACT_APP_KAKAO_MAP_KEY' --region $REGION --with-decryption --query 'Parameter.Value' --output text",
                        returnStdout: true
                    ).trim()
                    env.REACT_APP_KAKAO_MAP_KEY = kakaoKey

                    def apiUrl = sh(
                        script: "aws ssm get-parameter --name '/pinpung/REACT_APP_API_URL' --region $REGION --query 'Parameter.Value' --output text",
                        returnStdout: true
                    ).trim()
                    env.REACT_APP_API_URL = apiUrl

                    def s3Url = sh(
                        script: "aws ssm get-parameter --name '/pinpung/REACT_APP_S3_BASE_URL' --region $REGION --query 'Parameter.Value' --output text",
                        returnStdout: true
                    ).trim()
                    env.REACT_APP_S3_BASE_URL = s3Url
                }
            }
        }

        stage('Build React App') {
            steps {
                withEnv(["REACT_APP_KAKAO_MAP_KEY=${env.REACT_APP_KAKAO_MAP_KEY}", "REACT_APP_API_URL=${env.REACT_APP_API_URL}", "REACT_APP_S3_BASE_URL=${env.REACT_APP_S3_BASE_URL}"]) {
                    sh 'CI=false npm run build'
                }
            }
        }

        stage('Deploy to S3') {
            steps {
                sh 'aws s3 sync build/ s3://$S3_BUCKET --delete --region $REGION'
            }
        }
        
        stage('Invalidate CloudFront Cache') {
            steps {
                sh 'aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" --region $REGION'
            }
        }
    }


    post {
        success {
            echo 'Deployment completed successfully.'
        }
        failure {
            echo 'Deployment failed. Check logs for details.'
        }
    }
}
