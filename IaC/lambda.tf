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
      STAGE = "dev"
    }
  }
}
