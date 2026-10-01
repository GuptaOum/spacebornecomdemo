# Keeps the CloudFront distributions (and so the public URLs) across a full teardown.
# Dot-source this file, then call Release-CloudFront before `terraform destroy` and
# Adopt-CloudFront before `terraform apply`. Comments must match terraform/cloudfront.tf.

# Comments are tried in order. The spaceborn-dev names belong to the distributions created before the
# stack was renamed to prod; adopting them keeps their URLs, and the next apply rewrites the comment.
$KeptDistributions = @(
  @{ Address = 'aws_cloudfront_distribution.main[0]';   Comments = @('spaceborn-prod storefront and API', 'spaceborn-dev storefront and API') },
  @{ Address = 'aws_cloudfront_distribution.vendor[0]'; Comments = @('spaceborn-prod vendor hub', 'spaceborn-dev vendor hub') }
)

function Get-StateAddresses {
  param([string]$TerraformDir)
  Push-Location $TerraformDir
  try { return @(& terraform state list 2>$null) } finally { Pop-Location }
}

# Removes the distributions from Terraform state so `destroy` leaves them running in AWS.
function Release-CloudFront {
  param([string]$TerraformDir)
  $state = Get-StateAddresses $TerraformDir
  Push-Location $TerraformDir
  try {
    foreach ($d in $KeptDistributions) {
      if ($state -contains $d.Address) {
        & terraform state rm -no-color $d.Address | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "terraform state rm $($d.Address) failed" }
        Write-Host "  kept $($d.Address) (URL survives the teardown)" -ForegroundColor Green
      }
    }
  } finally { Pop-Location }
}

# Imports a surviving distribution back into state, so `apply` repoints it at the new ALB instead of creating a new URL.
function Adopt-CloudFront {
  param([string]$TerraformDir, [string]$Region = 'ap-south-1')
  $state = Get-StateAddresses $TerraformDir
  Push-Location $TerraformDir
  try {
    foreach ($d in $KeptDistributions) {
      if ($state -contains $d.Address) { continue }
      $id = $null
      foreach ($comment in $d.Comments) {
        $id = & aws cloudfront list-distributions --region $Region `
          --query "DistributionList.Items[?Comment=='$comment'].Id | [0]" --output text
        if ($LASTEXITCODE -ne 0) { throw 'aws cloudfront list-distributions failed' }
        if ($id -and $id -ne 'None') { break }
        $id = $null
      }
      if (-not $id) { continue }
      & terraform import -input=false -no-color $d.Address $id | Out-Null
      if ($LASTEXITCODE -ne 0) { throw "terraform import $($d.Address) $id failed" }
      Write-Host "  re-attached $($d.Address) -> $id" -ForegroundColor Green
    }
  } finally { Pop-Location }
}
