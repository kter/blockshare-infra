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


module "caller_identity" {
  source = "./modules/caller_identity"
}
