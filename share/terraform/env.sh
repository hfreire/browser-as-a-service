TF_VAR_state_aws_region=${ANTIFRAGILE_STATE_AWS_REGION}
TF_VAR_state_aws_s3_bucket=${ANTIFRAGILE_STATE_AWS_S3_BUCKET}
TF_VAR_docker_repo=${DOCKER_REPO}
TF_VAR_docker_image_tag=$(if [ -z "${VERSION-}" ]; then echo $(if [ -z "${DOCKER_TAG-}" ]; then echo latest; else echo "$DOCKER_TAG"; fi); else echo "$VERSION"; fi)
