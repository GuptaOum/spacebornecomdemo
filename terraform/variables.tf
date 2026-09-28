variable "supabase_url" {
  type        = string
  description = "Supabase API URL"
  default     = "https://ybcsjishccovgtwsdzxf.supabase.co"
}

variable "supabase_anon_key" {
  type        = string
  description = "Supabase Anon Key"
}

variable "firebase_api_key" {
  type        = string
  description = "Firebase Web API Key"
}

variable "ecr_image_uri" {
  type        = string
  description = "The URI of the Docker image in ECR"
}

variable "ecr_celery_image_uri" {
  type        = string
  description = "The URI of the Celery Docker image in ECR"
}

