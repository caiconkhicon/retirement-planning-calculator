output "s3_bucket_id" {
  value = aws_s3_bucket.static-web.id
}

output "cloudfront_distribution_domain_name" {
  description = "The domain name corresponding to the distribution. For example: d604721fxaaqy9.cloudfront.net."
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}