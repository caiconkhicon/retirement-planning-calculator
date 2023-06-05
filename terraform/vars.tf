variable "domain_name" {
  description = "The domain name to use for the Route53 record"
  type        = string
}

variable "cloudfront_ssl_support_method" {
  type        = string
  description = "Specifies how you want CloudFront to serve HTTPS requests. One of vip or sni-only."
  default     = "sni-only"
}

variable "cloudfront_minimum_protocol_version" {
  type        = string
  description = "The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections. "
  default     = "TLSv1.1_2016"
}

variable "cloudfront_price_class" {
  type        = string
  description = "The price class that corresponds with the maximum price that you want to pay for CloudFront service. One of PriceClass_All, PriceClass_200, PriceClass_100."
  default     = "PriceClass_100" 
}

variable "project_name" {
  type        = string
  description = "The name of the project"
  default     = "investment-website-static-web"
}