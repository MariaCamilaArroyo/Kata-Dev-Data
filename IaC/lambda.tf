resource "aws_lambda_function" "process_campaign_batch" {
  function_name = "processCampaignBatch"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 10

  filename         = "bootstrap.zip"
  source_code_hash = filebase64sha256("bootstrap.zip")

  environment {
    variables = {
      STAGE      = "dev", 
      PGHOST     = var.pg_host
      PGUSER     = var.pg_user
      PGPASSWORD = var.pg_password
      PGDATABASE = var.pg_database
      PGPORT     = "5432"
      REDIS_URL  = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:6379"
    }
  }
}
