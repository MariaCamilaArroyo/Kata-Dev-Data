variable "region" {
  default = "us-east-2"
}

variable "db_username" {
  default = "adminuser"
}

variable "db_password" {
  default = "Ch4nG3m3"
}

variable "cron_expression" {
  description = "Expresión CRON para ejecución automática del batch"
  type        = string
  default     = "cron(0 */2 * * ? *)"
}
