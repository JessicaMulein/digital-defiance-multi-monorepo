#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=$(realpath "${SCRIPT_DIR}/..")
ROOT_PACKAGE_NAME=$("$SCRIPT_DIR"/get_package_name.sh "${PROJECT_ROOT}")
OPWD="$(pwd)"

# having an order is important to deal with simple depencencies like a shared library
# the build script will skip the root directory, but the yarn script needs to start
# from the root directory, and this script is called from both, so we need to support
# both cases
order=""
packages=()
packages_to_build=()
skip=""
whitelist=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --whitelist=*)
      whitelist="${1#*=}"
      shift
      ;;
    --skip=*)
      skip="${1#*=}"
      shift
      ;;
    --order=*)
      order="${1#*=}"
      shift
      ;;
    --help)
      echo "Usage: $0 [--order=package1,package2,...] [--skip=package1,package2,...] [--whitelist=package1,package2,...] [package1 package2 ...]"
      echo "  --order=package1,package2,..."
      echo "    Specify the order in which packages should be built.  This is important for packages that have simple dependencies"
      echo "    like a shared library.  The build script will skip the root directory, but the yarn script needs to start from the"
      echo "    root directory, and this script is called from both, so we need to support both cases."
      echo "  --skip=package1,package2,..."
      echo "    Specify packages to skip.  This is useful for packages that are not part of the monorepo, but are still in the"
      echo "    packages directory."
      echo "  --whitelist=package1,package2,..."
      echo "    Specify packages to include.  This is useful for packages that are not part of the monorepo, but are still in the"
      echo "    packages directory."
      echo "  package1 package2 ..."
      echo "    Specify packages to include.  This is useful for packages that are not part of the monorepo, but are still in the"
      echo "    packages directory."
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

packages+=(".")

while IFS= read -r -d '' package; do
  package="${package#packages/}"
  package="${package#/}"
  packages+=("${package}")
done < <(find packages -mindepth 1 -maxdepth 1 -type d -print0)

remove_duplicates() {
  local input_array=("$@")
  local output_array=()
  local elem

  for elem in "${input_array[@]}"; do
    if ! [[ ${output_array[*]} =~ (^|[[:space:]])"${elem}"($|[[:space:]]) ]]; then
      output_array+=("$elem")
    fi
  done

  echo "${output_array[@]}"
}

makeVarName() {
    local varName="${1%/}"
    varName="$(echo "$varName" | tr '[:lower:]' '[:upper:]')"
    varName="${varName//[^[:alnum:]]/_}"
    echo "$varName"
}

value_in_list() {
  local value="$1"
  local list="$2"

  IFS=',' read -ra list_array <<< "$list"
  for elem in "${list_array[@]}"; do
    if [ "$elem" == "$value" ]; then
      return 0
    fi
  done

  return 1
}

cd "${PROJECT_ROOT}"
for package in "${packages[@]}"; do
  if [ "$package" == "." ]; then
    packageName=$(makeVarName "${ROOT_PACKAGE_NAME}")
  else
    packageName=$(makeVarName "$package")
  fi
  if [ -n "$whitelist" ]; then
    if value_in_list "$package" "$whitelist"; then
      if [ "$whitelist" == "." ]; then
        packages_to_build+=(".")
      else
        packages_to_build+=("packages/${package}")
      fi

    else
      declare "SKIP_$packageName=true"
    fi
  elif [ -z "$skip" ] || ! value_in_list "$package" "$skip"; then
    if [ "$package" == "." ]; then
      packages_to_build+=(".")
    else
      packages_to_build+=("packages/${package}")
    fi
  fi
done

packages_to_build=($(remove_duplicates "${packages_to_build[@]}"))

if [ -n "$order" ]; then
  IFS=',' read -ra ordered_packages <<< "$order"
  ordered_package_paths=()
  for ordered_package in "${ordered_packages[@]}"; do
    if [ "$ordered_package" == "${ROOT_PACKAGE_NAME}" ]; then
      ordered_package_paths+=(".")
    else
      ordered_package_paths+=("packages/${ordered_package}")
    fi
  done


  # Create a new array to store the final build order
  final_build_order=()

  # First, add the ordered packages
  for ordered_package_path in "${ordered_package_paths[@]}"; do
    if [[ " ${packages_to_build[@]} " =~ " ${ordered_package_path} " ]]; then
      final_build_order+=("$ordered_package_path")
    fi
  done

 # Then, add the remaining packages that were not specified in the order
  for package_to_build in "${packages_to_build[@]}"; do
    if ! [[ " ${ordered_package_paths[@]} " =~ " ${package_to_build} " ]]; then
      final_build_order+=("$package_to_build")
    fi
  done

  # Finally, update the packages_to_build array with the final build order
  packages_to_build=("${final_build_order[@]}")
fi

for package_to_build in "${packages_to_build[@]}"; do
  if [ -f "$package_to_build/package.json" ]; then
    echo "$package_to_build"
  fi
done