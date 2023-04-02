#!/bin/bash
OPWD=`pwd`
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=$(realpath "${SCRIPT_DIR}/..")

cd "${PROJECT_ROOT}"
PACKAGES=$("${SCRIPT_DIR}/filter_package_paths.sh" --order=duality-social,duality-social-lib,duality-social-angular,duality-social-node,duality-social-queue-worker $@)
for package in ${PACKAGES[@]}; do
    echo ""
    echo "package: $package"
    PACKAGE_PATH=$(dirname $package)
    echo "Installing dependencies for $PACKAGE_PATH"
    cd "${PROJECT_ROOT}/${PACKAGE_PATH}"
    if [ $? -ne 0 ]; then
        echo "Failed to cd to $PACKAGE_PATH"
        exit 1
    fi
    npm update && yarn
    if [ $? -ne 0 ]; then
        echo "Failed to install dependencies for $PACKAGE_PATH"
        exit 1
    fi
done
rm -f "${PROJECT_ROOT}/package-lock.json" "${PROJECT_ROOT}/packages/*/package-lock.json"
cd "${OPWD}"