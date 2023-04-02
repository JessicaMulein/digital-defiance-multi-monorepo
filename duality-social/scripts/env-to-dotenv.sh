#!/bin/bash
# given a list of variables, write them to a .env file
# if no arguments passed in, use the default list:
# CLIENT_ID
# CLOUD_INSTANCE
# COOKIE_ENABLED
# EXPRESS_SESSION_SECRET
# FONTAWESOME_TOKEN
# HOST
# MONGO_URL
# MSAL_CLIENT_SECRET
# NODE_ENV
# OPENAI_MODEL
# OPENAI_DEPLOYMENT
# OPENAI_PROVIDER
# OPENAI_API_KEY
# OPENAI_ORGANIZATION
# PORT
# SSL_ENABLED
# TENANT_ID
VAR_LIST=(CLIENT_ID CLOUD_INSTANCE COOKIE_ENABLED EXPRESS_SESSION_SECRET FONTAWESOME_TOKEN HOST MONGO_URL MSAL_CLIENT_SECRET NODE_ENV OPENAI_MODEL OPENAI_DEPLOYMENT OPENAI_PROVIDER OPENAI_API_KEY OPENAI_ORGANIZATION PORT SSL_ENABLED TENANT_ID)

if [ $# -gt 0 ]; then
    unset VAR_LIST
    VAR_LIST=$@
fi

for var in ${VAR_LIST[@]}; do
  if [ -z "${!var}" ]; then
    echo "Skipping ${var} because it is not set"
  else
    echo "Setting ${var} to ${!var}"
    echo "${var}=${!var}" >> .env
  fi
done