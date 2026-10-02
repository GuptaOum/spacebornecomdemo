# CDN in front of the public load balancer. Three jobs:
#   1. Cache Next.js build assets at the edge so a task never serves the same chunk twice.
#   2. Give the storefront and vendor hub HTTPS on *.cloudfront.net names, before a real domain exists.
#   3. Keep those names stable. down.ps1 / `spaceborn.ps1 destroy` detach both distributions from
#      state instead of deleting them, and `spaceborn.ps1 up` re-imports them by `comment`, so the
#      URLs (and the Firebase authorized domains) survive a full teardown. Idle distributions cost $0.
# The vendor hub is a separate app at the same root path, so it gets its own distribution rather
# than a path behaviour on the storefront one.
#
# With a domain (acm_certificate_arn + cloudfront_certificate_arn set) CloudFront stays in front:
#   viewer ──HTTPS──▶ CloudFront ──HTTPS──▶ origin.<domain> / vendor-origin.<domain> (CNAMEs to the ALB)
# The ALB certificate covers *.<domain>, so the CloudFront→ALB hop is encrypted too. The two origin
# hostnames exist because CloudFront rewrites the Host header to the origin's name; the ALB tells the
# storefront and vendor hub apart by that header. The *.cloudfront.net URLs keep working alongside
# the custom domain.

locals {
  cloudfront_enabled = var.enable_cloudfront
  alb_origin_id      = "alb-public"
  vendor_origin_id   = "alb-public-vendor"
  # Lookup keys for re-adopting the distributions after a teardown. Do not change them.
  cloudfront_storefront_comment = "${local.name} storefront and API"
  cloudfront_vendor_comment     = "${local.name} vendor hub"

  # Where CloudFront fetches from. Without a domain it is the ALB's own name over plain HTTP; with
  # one it is a CNAME to the ALB that the ALB certificate covers, over HTTPS.
  storefront_origin_host = local.https_enabled ? "origin.${var.domain_name}" : aws_lb.public.dns_name
  vendor_origin_host     = local.https_enabled ? "vendor-origin.${var.domain_name}" : aws_lb.public.dns_name
  origin_protocol        = local.https_enabled ? "https-only" : "http-only"
  cloudfront_custom_cert = local.https_enabled && var.cloudfront_certificate_arn != ""
}

# AWS-managed policies, referenced by ID so no custom policy has to be maintained.
locals {
  cache_optimized_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
  cache_disabled_id  = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled
  forward_all_id     = "b689b0a8-53d0-40ab-baf2-68738e2966ac" # AllViewerExceptHostHeader
}

resource "aws_cloudfront_distribution" "main" {
  count = local.cloudfront_enabled ? 1 : 0

  enabled = true
  comment = local.cloudfront_storefront_comment
  # PriceClass_100 has no Indian edge locations; 200 adds Mumbai/Chennai/Hyderabad.
  price_class     = "PriceClass_200"
  http_version    = "http2and3"
  is_ipv6_enabled = true
  aliases         = local.cloudfront_custom_cert ? [var.domain_name] : []

  origin {
    origin_id   = local.alb_origin_id
    domain_name = local.storefront_origin_host

    custom_origin_config {
      http_port  = 80
      https_port = 443
      # Without a domain the ALB has no certificate, so this hop is plain HTTP and bearer tokens ride
      # it in cleartext. With a domain it is HTTPS to origin.<domain>, covered by the ALB certificate.
      origin_protocol_policy   = local.origin_protocol
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
    }
  }

  # Everything not matched below: HTML, server actions and the whole API. Never cached, and the
  # Authorization header must survive or every authenticated request would fail.
  default_cache_behavior {
    target_origin_id         = local.alb_origin_id
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = local.cache_disabled_id
    origin_request_policy_id = local.forward_all_id
  }

  # Next.js fingerprints these filenames, so they can be cached hard and forever.
  ordered_cache_behavior {
    path_pattern           = "/_next/static/*"
    target_origin_id       = local.alb_origin_id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = local.cache_optimized_id
  }

  ordered_cache_behavior {
    path_pattern           = "/spaceborn-logo.*"
    target_origin_id       = local.alb_origin_id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = local.cache_optimized_id
  }

  viewer_certificate {
    cloudfront_default_certificate = local.cloudfront_custom_cert ? null : true
    acm_certificate_arn            = local.cloudfront_custom_cert ? var.cloudfront_certificate_arn : null
    ssl_support_method             = local.cloudfront_custom_cert ? "sni-only" : null
    minimum_protocol_version       = local.cloudfront_custom_cert ? "TLSv1.2_2021" : "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_cloudfront_distribution" "vendor" {
  count = local.cloudfront_enabled ? 1 : 0

  enabled         = true
  comment         = local.cloudfront_vendor_comment
  price_class     = "PriceClass_200"
  http_version    = "http2and3"
  is_ipv6_enabled = true
  aliases         = local.cloudfront_custom_cert ? ["vendor.${var.domain_name}"] : []

  origin {
    origin_id   = local.vendor_origin_id
    domain_name = local.vendor_origin_host

    custom_origin_config {
      # Without a domain the vendor hub lives on the ALB's port 8080; with one it is routed by host.
      http_port                = local.https_enabled ? 80 : 8080
      https_port               = 443
      origin_protocol_policy   = local.origin_protocol
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
    }
  }

  default_cache_behavior {
    target_origin_id         = local.vendor_origin_id
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = local.cache_disabled_id
    origin_request_policy_id = local.forward_all_id
  }

  ordered_cache_behavior {
    path_pattern           = "/_next/static/*"
    target_origin_id       = local.vendor_origin_id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = local.cache_optimized_id
  }

  viewer_certificate {
    cloudfront_default_certificate = local.cloudfront_custom_cert ? null : true
    acm_certificate_arn            = local.cloudfront_custom_cert ? var.cloudfront_certificate_arn : null
    ssl_support_method             = local.cloudfront_custom_cert ? "sni-only" : null
    minimum_protocol_version       = local.cloudfront_custom_cert ? "TLSv1.2_2021" : "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
