resource "aws_s3_bucket" "staging_campaigns" {
  bucket = "staging-campaigns-bucket"
}

resource "aws_s3_object" "campaigns_folder" {
  bucket = aws_s3_bucket.staging_campaigns.bucket
  key    = "campaigns/"
}

resource "aws_s3_object" "errors_folder" {
  bucket = aws_s3_bucket.staging_campaigns.bucket
  key    = "errors/"
}

resource "aws_s3_bucket_policy" "staging_campaigns_policy" {
  bucket = aws_s3_bucket.staging_campaigns.bucket

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = [
          "arn:aws:s3:::staging-campaigns-bucket/campaigns/*",
          "arn:aws:s3:::staging-campaigns-bucket/errors/*"
        ]
        Principal = "*"
      }
    ]
  })
}
