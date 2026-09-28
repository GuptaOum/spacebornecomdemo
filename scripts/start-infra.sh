#!/bin/bash
echo "Starting Spaceborn Infrastructure..."
cd terraform
terraform init
terraform apply -auto-approve \
  -var="supabase_anon_key=$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -var="firebase_api_key=$NEXT_PUBLIC_FIREBASE_API_KEY"
echo "Infrastructure deployment complete!"
