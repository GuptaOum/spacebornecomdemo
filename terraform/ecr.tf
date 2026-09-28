resource "aws_ecr_repository" "spaceborn" {
  name                 = "spaceborn-frontend"
  image_tag_mutability = "MUTABLE"

  # CRITICAL: This ensures terraform destroy wipes out the repo AND all images inside it
  force_destroy = true 

  image_scanning_configuration {
    scan_on_push = true
  }
}
