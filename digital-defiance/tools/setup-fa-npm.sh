#!/bin/bash
# make sure env var is set
if [ -z "${FONTAWESOME_TOKEN}" ]; then
    echo "FONTAWESOME_TOKEN not set"
    echo "Checking to see if the .npmrc file is already set up"
    hasFARegistry=$(npm config --global get "@fortawesome:registry")
    # check if the registry has the secret (it only reveals it has the secret, not the value)
    hasFASecret=$(npm config --global list | grep "//npm.fontawesome.com/:_authToken = (protected)")
    if [ -z "${hasFARegistry}" ] || [ -z "${hasFASecret}" ]; then
        echo "You need to set up your .npmrc file to use the Font Awesome npm registry."
        echo "Otherwise ./yarn-all.sh will fail."
        echo "Please run ./setup-fa-npm.sh to do this."
        exit 1
    fi
    echo "Looks like the .npmrc file is already set up"
    echo "We're also going to export this so that it's available for docker builds"
    testToken=$([ -f ~/.npmrc ] && grep npm\.fontawesome\.com\/\:_authToken= ~/.npmrc | sed -E 's/^(.*:_authToken=)//')
    if [ -z "${testToken}" ]; then
        echo "Failed to get the token from the .npmrc file"
        exit 1
    fi
    export FONTAWESOME_TOKEN=${testToken}
    exit 0
fi
echo "Setting up .npmrc file using the FONTAWESOME_TOKEN env var, which is a secret"
npm config set "@fortawesome:registry" https://npm.fontawesome.com/
npm config set "//npm.fontawesome.com/:_authToken" ${FONTAWESOME_TOKEN}
