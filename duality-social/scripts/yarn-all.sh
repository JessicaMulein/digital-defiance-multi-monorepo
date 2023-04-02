#!/bin/bash
_CMD="install"
if [ "$1" == "--upgrade" ]; then
    _CMD="upgrade"
    shift
fi
if [ "$1" == "--dry-run" ]; then
    let DRY_RUN=1
fi

OPWD=`pwd`
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=$(realpath "${SCRIPT_DIR}/..")

# setup-fa-npm.sh will set up the .npmrc file if it's not already set up, as long as FONTAWESOME_TOKEN is set
# If it's not set, but the token is provided, then it will set up the .npmrc file
# If it's not set and the token is not provided, then it will exit with an error
# If it's already set up, then it will exit with no error (success)
"${SCRIPT_DIR}"/setup-fa-npm.sh || exit 1

PACKAGES=$("${SCRIPT_DIR}/filter_package_paths.sh" --order=duality-social,duality-social-lib,duality-social-angular,duality-social-node,duality-social-queue-worker $@)
cd "${PROJECT_ROOT}"
for package in ${PACKAGES[@]}; do
    echo ""
    echo "package: $package"
    PACKAGE_PATH=$(dirname $package)
    echo "Installing dependencies for $PACKAGE_PATH"
    cd "${PACKAGE_PATH}"
    if [ $? -ne 0 ]; then
        echo "Failed to cd to $PACKAGE_PATH"
        exit 2
    fi
    if [ -z "$DRY_RUN" ]; then
        echo "Running yarn $_CMD $@"
        #yarn $_CMD $@
    fi
    if [ $? -ne 0 ]; then
        echo "Failed to install dependencies for $PACKAGE_PATH"
        exit 3
    fi
    cd "${OPWD}"
    if [ $? -ne 0 ]; then
        echo "Failed to cd to $OPWD"
        exit 4
    fi
done
rm -f "${PROJECT_ROOT}/package-lock.json" "${PROJECT_ROOT}/packages/*/package-lock.json"
cd "${OPWD}"



