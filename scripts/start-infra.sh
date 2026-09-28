#!/bin/bash
set -e

echo "Starting Spaceborn Infrastructure Deployment..."

# Change to terraform directory
cd terraform

echo "Initializing Terraform..."
terraform init

echo "Step 1: Creating ECR Repository..."
terraform apply -target=aws_ecr_repository.spaceborn -auto-approve

# Get AWS Account ID and Region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
REPO_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/spaceborn-frontend"

echo "Logging into AWS ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

echo "Building Spaceborn Docker image..."
cd ..
docker build -t spaceborn-frontend -f shoppingwebsite-frontend/Dockerfile .

echo "Tagging and pushing image to ECR..."
docker tag spaceborn-frontend:latest $REPO_URI:latest
docker push $REPO_URI:latest

echo "Step 2: Deploying remaining ECS Infrastructure (VPC, Cluster, Fargate Tasks)..."
cd terraform
terraform apply -auto-approve \
  -var="supabase_url=$NEXT_PUBLIC_SUPABASE_URL" \
  -var="supabase_anon_key=$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -var="firebase_api_key=$NEXT_PUBLIC_FIREBASE_API_KEY" \
  -var="ecr_image_uri=$REPO_URI:latest"

echo "======================================"
echo "Infrastructure deployment complete!"
echo "Public App is exposed on port 3000."
echo "Admin App is strictly isolated on port 4000."
echo "======================================"
