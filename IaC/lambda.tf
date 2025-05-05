resource "aws_lambda_function" "process_campaign_batch" {
  filename         = "<RUTA_DEL_REPOSITORIO_BACKEND>/lambda.zip"  # Ruta al archivo .zip del otro repositorio
  function_name    = "processCampaignBatch"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("<RUTA_DEL_REPOSITORIO_BACKEND>/lambda.zip") # Esto toma el hash del .zip generado
}
