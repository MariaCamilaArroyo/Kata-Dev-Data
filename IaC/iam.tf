resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_s3_policy" {
  name = "lambda_s3_policy"
  role = aws_iam_role.lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:ListBucket"
        ],
        Resource = "arn:aws:s3:::staging-campaigns-bucket"
      },
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        Resource = [
          "arn:aws:s3:::staging-campaigns-bucket/input/*",
          "arn:aws:s3:::staging-campaigns-bucket/campaigns/*",
          "arn:aws:s3:::staging-campaigns-bucket/errors/*"
        ]
      }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_s3_bucket_policy" "staging_campaigns_policy" {
  bucket = "staging-campaigns-bucket"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Effect    = "Allow"
        Principal = "*"
        Resource  = [
          "arn:aws:s3:::staging-campaigns-bucket/campaigns/*",
          "arn:aws:s3:::staging-campaigns-bucket/errors/*"
        ]
      }
    ]
  })
}
