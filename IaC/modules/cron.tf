resource "aws_cloudwatch_event_rule" "campaign_batch_cron" {
  name                = "campaign-batch-schedule"
  description         = "Ejecución automática de Lambda para procesamiento batch"
  schedule_expression = var.cron_expression
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.campaign_batch_cron.name
  target_id = "LambdaBatchProcessor"
  arn       = aws_lambda_function.process_campaign_batch.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.process_campaign_batch.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.campaign_batch_cron.arn
}
