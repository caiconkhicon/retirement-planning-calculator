resource "random_string" "random" {
  length      = 4
  min_numeric = 4
}

resource "aws_s3_bucket" "static-web" {
  bucket = "${var.project_name}-${random_string.random.result}"
}

resource "aws_s3_bucket_ownership_controls" "static-web" {
  bucket = aws_s3_bucket.static-web.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "static-web" {
  depends_on = [aws_s3_bucket_ownership_controls.static-web]
  bucket     = aws_s3_bucket.static-web.id
  acl        = "private"
}

resource "aws_s3_object" "static-web-html" {
  key          = "main.html"
  bucket       = aws_s3_bucket.static-web.id
  source       = "../main.html"
  content_type = "text/html"
}

resource "aws_s3_object" "static-web-js" {
  key          = "main.js"
  bucket       = aws_s3_bucket.static-web.id
  source       = "../main.js"
  content_type = "text/javascript"
}

resource "aws_s3_object" "static-web-ads" {
  key          = "ads.txt"
  bucket       = aws_s3_bucket.static-web.id
  source       = "../ads.txt"
  content_type = "text/plain"
}

locals {

  cloudfront_website_bucket_access = jsonencode({
    "Version" : "2008-10-17",
    "Id" : "CloudfrontAccess to Website Files",
    "Statement" : [
      {
        "Sid" : "1",
        "Effect" : "Allow",
        "Principal" : {
          "AWS" : "${aws_cloudfront_origin_access_identity.cloudfront_oai.iam_arn}"
        },
        "Action" : "s3:GetObject",
        "Resource" : "arn:aws:s3:::${aws_s3_bucket.static-web.id}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_policy" "static-web" {

  bucket = aws_s3_bucket.static-web.id
  policy = local.cloudfront_website_bucket_access
}