variable "infrastructure_name" {
  default = "antifragile-infrastructure"
}

variable "docker_repo" {
}

variable "docker_image_tag" {
}

variable "name" {
  default = "browser-as-a-service"
}

variable "aws_region" {
  default = "eu-west-1"
}

variable "api_keys" {
  type    = list(string)
  default = [ ]
}

variable "log_level" {
  default = "debug"
}
