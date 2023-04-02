#!/bin/bash
OPWD=$(pwd)
if [ $# -gt 0 ]; then
  if [ "$1" == "--help" ]; then
    echo "Usage: get_root_package_name.sh [path]"
    echo "  path: The path to the package.json file to use. If not specified, the current directory is used."
    exit 0
  elif [ "$1" == "--no-strip" ]; then
    NO_STRIP=true
    shift
  fi
fi

# get the package name of every argument
for arg in "$@"; do
  if [ -d "${arg}" ]; then
    PACKAGE_FILE="${arg}/package.json"
  elif [ -f "${arg}" ]; then
    FILENAME=$(basename "${arg}")
    if [ $FILENAME == "package.json" ]; then
      PACKAGE_FILE=${arg}
    fi
  fi

  # Check if the package.json file exists in the specified directory
  if [ -f "${PACKAGE_FILE}" -o -d "${PACKAGE_FILE}" ]; then
    if [ -d "${PACKAGE_FILE}" ]; then
      cd "${PACKAGE_FILE}"
      PACKAGE_FILE="${PACKAGE_FILE}/package.json"
    else
      cd $(dirname $PACKAGE_FILE)
    fi
    PACKAGE_NAME=$(npm run env | grep "npm_package_name" | awk -F "=" '{print $NF}')
    if [ -z "${PACKAGE_NAME}" ]; then
      echo "Failed to get package name from ${PACKAGE_FILE}"
      exit 1
    fi
    if [ -z "${NO_STRIP}" ]; then
      # if the package name is an @blah/package, then we want to return after the /
      PACKAGE_NAME=$(echo $PACKAGE_NAME | awk -F "/" '{print $NF}')
    fi
    cd $OPWD
    echo $PACKAGE_NAME
  fi
done