locals {
  s3_origin_id = "myS3Origin"
}

resource "aws_cloudfront_origin_access_identity" "cloudfront_oai" {
  comment = "investment_website_OAI"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.static-web.bucket_regional_domain_name
    origin_id   = local.s3_origin_id
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.cloudfront_oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "HTTPS frontend for investment website"
  default_root_object = "main.html"

  # logging_config {
  #   include_cookies = false
  #   bucket          = "mylogs.s3.amazonaws.com"
  #   prefix          = "myprefix"
  # }

  aliases = [var.domain_name]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = var.cloudfront_price_class

  restrictions {
    geo_restriction {
      restriction_type = "blacklist"
      locations        = ["BR", "CN", "CU", "IR", "IQ", "KP", "SY", "NG", "RO", "RU", "VE", "SD", "SS", "UA", "YE"]
    }
  }

  tags = {
    Environment = "production"
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.ssl_certificate_validation.certificate_arn
    ssl_support_method       = var.cloudfront_ssl_support_method
    minimum_protocol_version = var.cloudfront_minimum_protocol_version
  }
}
