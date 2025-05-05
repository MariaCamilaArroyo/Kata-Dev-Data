resource "aws_s3_bucket" "staging_campaigns" {
  bucket = "staging-campaigns-bucket"
  force_destroy = false
}

resource "aws_s3_bucket_public_access_block" "staging_campaigns_public_access_block" {
  bucket = aws_s3_bucket.staging_campaigns.bucket
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}



resource "aws_s3_object" "campaigns_folder" {
  bucket = aws_s3_bucket.staging_campaigns.bucket
  key    = "campaigns/"
}

resource "aws_s3_object" "errors_folder" {
  bucket = aws_s3_bucket.staging_campaigns.bucket
  key    = "errors/"
}
