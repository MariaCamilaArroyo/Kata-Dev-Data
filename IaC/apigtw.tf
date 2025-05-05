resource "aws_lambda_function" "campaign_api" {
  function_name = "campaign-api"
  runtime       = "nodejs18.x"
  handler       = "routes/apiRouter.handler"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "dist/lambda.zip"
  environment {
    variables = {
      PGHOST     = aws_db_instance.campaigns_db.endpoint
      REDIS_URL  = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:6379"
    }
  }
}

resource "aws_apigatewayv2_api" "campaigns_api" {
  name          = "campaigns-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.campaigns_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.campaign_api.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_campaigns" {
  api_id    = aws_apigatewayv2_api.campaigns_api.id
  route_key = "GET /campaigns"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "get_campaign_by_id" {
  api_id    = aws_apigatewayv2_api.campaigns_api.id
  route_key = "GET /campaigns/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.campaign_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.campaigns_api.execution_arn}/*/*"
}
