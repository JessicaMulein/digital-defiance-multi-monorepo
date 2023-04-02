#!/bin/bash
_CMD="build"
if [ "$1" == "--othercmd" ]; then
    _CMD="$2"
    shift
    shift
fi
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PACKAGE_ROOT=$(realpath "${SCRIPT_DIR}/..")
ROOT_PACKAGE_NAME=$("${SCRIPT_DIR}/get_package_name.sh" "${PACKAGE_ROOT}/package.json")
PACKAGES_TO_BUILD=$("${SCRIPT_DIR}/filter_package_paths.sh" --order=duality-social,duality-social-lib,duality-social-angular,duality-social-node,duality-social-queue-worker $@)

OPWD=$(pwd)
cd "${PACKAGE_ROOT}"
for PACKAGE_FILE in ${PACKAGES_TO_BUILD}; do
    PACKAGE_NAME=$("${SCRIPT_DIR}/get_package_name.sh" "${PACKAGE_FILE}")
    echo ""
    echo "Building ${PACKAGE_NAME} @ ${PACKAGE_FILE}"
    
    if [ "${PACKAGE_NAME}" == "${ROOT_PACKAGE_NAME}" ]; then
        echo "Skipping root package"
    else
        echo "Running npx nx $_CMD \"${PACKAGE_NAME}\" $@"
        npx nx "$_CMD" "${PACKAGE_NAME}" $@
    fi
    if [ $? -ne 0 ]; then
        echo "Failed to build ${PACKAGE_NAME} @ ${PACKAGE_FILE}"
        exit 1
    fi
done
cd "${OPWD}"

echo "Done building duality-social"