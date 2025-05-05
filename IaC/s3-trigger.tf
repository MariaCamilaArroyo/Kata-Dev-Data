resource "aws_lambda_permission" "allow_s3_invoke" {
  statement_id  = "AllowExecutionFromS3"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.process_campaign_batch.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.staging_campaigns.arn
}

resource "aws_s3_bucket_notification" "trigger_lambda_on_upload" {
  bucket = aws_s3_bucket.staging_campaigns.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.process_campaign_batch.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "campaigns/"
    filter_suffix       = ".csv"
  }

  depends_on = [aws_lambda_permission.allow_s3_invoke]
}
