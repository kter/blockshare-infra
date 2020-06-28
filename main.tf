provider "aws" {
  region = "us-east-1"
  profile = "private"
}

locals {
  project_name = "bloskshare"
  domain = "tomohiko.io"
}

variable "env" {
  default = "stg"
}

variable "db_pass" {
  default = "password"
}

terraform {
  backend "s3" {
    bucket = "terraform.blockshare.tomohiko.io"
    key = "blockshare/terraform.tfstate"
    region = "us-east-1"
  }
}

// TODO: use aws_elb_service_account
module "caller_identity" {
  source = "./modules/caller_identity"
}
