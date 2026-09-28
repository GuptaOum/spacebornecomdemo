#!/bin/bash
echo "Tearing down Spaceborn Infrastructure to save costs..."
cd terraform
terraform destroy -auto-approve \
  -var="supabase_anon_key=$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -var="firebase_api_key=$NEXT_PUBLIC_FIREBASE_API_KEY"
echo "Infrastructure completely destroyed!"
