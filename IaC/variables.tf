variable "region" {
  default = "us-east-2"
}

variable "db_username" {
  default = "admin"
}

variable "db_password" {
  description = "RDS DB password"
  sensitive   = true
}
