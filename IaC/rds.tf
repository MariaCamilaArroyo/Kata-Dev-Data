resource "aws_db_instance" "campaigns_db" {
  identifier           = "campaigns-db"
  engine               = "postgres"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  db_name              = "campaigns_db"  # Cambié 'name' por 'db_name'
  username             = var.db_username
  password             = var.db_password
  skip_final_snapshot  = true
  publicly_accessible  = true
}
