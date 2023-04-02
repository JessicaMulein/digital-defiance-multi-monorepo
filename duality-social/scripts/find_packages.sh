#!/bin/bash
# if arguments are present, assume they are package names
# walk through all package jsons and look convert to files


SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT_PACKAGE_NAME=$(${SCRIPT_DIR}/get_package_name.sh "${SCRIPT_DIR}/package.json")
for arg in "$@"; do
    if [ "${arg}" == "${ROOT_PACKAGE_NAME}" ]; then
        PACKAGE_FILE="${SCRIPT_DIR}/package.json"
    elif [ -d "${SCRIPT_DIR}/packages/${arg}" -a -f "${SCRIPT_DIR}/packages/${arg}/package.json" ]; then
        PACKAGE_FILE="${SCRIPT_DIR}/packages/${arg}/package.json"
    elif [ -f "${arg}" ]; then
        PACKAGE_FILE="${arg}"
    else
        echo "Invalid package name or path: ${arg}"
        exit 1
    fi
    echo "${PACKAGE_FILE}"
done