#!/bin/bash
OPWD=$(pwd)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=$(realpath "${SCRIPT_DIR}/..")

cd "${PROJECT_ROOT}"

let argNum=0
let dockerBuild=0
if [ "$NODE_ENV" == "production" ]; then
    export buildEnv=production
    export productionBuild=1
else
    export buildEnv=development
    export productionBuild=0
fi
echo "buildEnv: $buildEnv (from NODE_ENV, or development if NODE_ENV is not set)"
for arg in "$@"; do
    # any arguments following a -- will be passed to the build script
    if [ "$arg" == "--help" ]; then
        echo "Usage: ./full-ci.sh [--checkout=commit|--pull-latest] {--docker} {--skip=node_modules_clean} {--skip=git_reset} {--skip=yarn} {--skip=build} -- [build script args]"
        echo "  --checkout=commit: checkout a specific commit before running"
        echo "  --pull-latest: pull latest from origin before running"
        echo "  --production: set NODE_ENV=production and build for production"
        echo "  --docker: run the build in a docker container instead of running yarn and build directly. implies --skip=yarn and --skip=build"
        echo "  --skip=docusaurus_clear: skip clearing the docusaurus build directory"
        echo "  --skip=node_modules_clean: skip cleaning node_modules"
        echo "  --skip=git_reset: skip git reset --hard"
        echo "  --skip=setup-fa-npm: skip ./setup-fa-npm.sh"
        echo "  --skip=yarn: skip ./yarn-all.sh"
        echo "  --skip=build: skip ./build-all.sh"
        echo "  --skip=sleep: skip the pauses before destructive operations"
        echo "  --whitelist=package1,package2: only build the specified packages from packages/*"
        echo ""
        echo "Anything past -- will be passed to either ./build-all.sh or the docker build script"
        exit 0
    elif [ "$arg" == "--production" ]; then
        echo "We will build for production"
        export NODE_ENV=production
        export buildEnv=production
        export productionBuild=1
        shift
    elif [ "$arg" == "--docker" ]; then
        echo "We will run the build in a docker container"
        echo "We will skip ./yarn-all.sh"
        echo "We will skip ./build-all.sh"
        export DOCKER_BUILD=1
        export SKIP_YARN=1
        export SKIP_BUILD=1
        shift
    elif [ "$arg" == "--skip=node_modules_clean" ]; then
        echo "We will skip cleaning out node_modules for each package"
        export SKIP_NODE_MODULES_CLEAN=1
        shift
    elif [ "$arg" == "--skip=docusaurus_clear" ]; then
        echo "We will skip clearing the docusaurus build directory"
        export SKIP_DOCUSAURUS_CLEAR=1
        shift
    elif [ "$arg" == "--skip=git_reset" ]; then
        echo "We will skip git reset --hard"
        export SKIP_GIT_RESET=1
        shift
    elif [ "$arg" == "--skip=sleep" ]; then
        echo "We will skip the sleep before destructive operations"
        export SKIP_SLEEP=1
        shift
    elif [ "$arg" == "--skip=setup-fa-npm" ]; then
        echo "We will skip ./setup-fa-npm.sh"
        export SKIP_SETUP_FA_NPM=1
        shift
    elif [ "$arg" == "--skip=yarn" ]; then
        echo "We will skip ./yarn-all.sh"
        export SKIP_YARN=1
        shift
    elif [ "$arg" == "--skip=build" ]; then
        echo "We will skip ./build-all.sh"
        export SKIP_BUILD=1
        shift
    elif [[ "$arg" == "--checkout="* ]]; then
        hash=${arg:11}
        echo "Checking out hash $hash"
        #git checkout $hash || exit 2
        shift
    elif [ "$arg" == "--pull-latest" ]; then
        #echo "Determining current branch"
        #currentBranch=$(git rev-parse --abbrev-ref HEAD)
        #echo "Fetching all and pulling latest from origin on the current branch: $currentBranch"
        #git fetch --all && git pull origin ${currentBranch} || exit 4
        shift
    elif [ "$arg" == "--whitelist="* ]; then
        whitelist=${arg:12}
        echo "Whitelisting packages: $whitelist"
        export WHITELIST=$whitelist
        shift
    elif [ "$arg" == "--" ]; then
        #shift everything before this so all we have left are the arguments to pass to the build script
        #shift or set args to begin from after the -- argument
        shift
        break;
    fi
    let argNum=argNum+1
done



if [ -z "$SKIP_DOCUSAURUS_CLEAR" ]; then
    echo ""
    echo "Running docusaurus clear"
    cd "${PROJECT_ROOT}/packages/duality-social-docs" && npx docusaurus clear || exit 4
    cd "${SCRIPT_DIR}"
else
    echo "Skipping docusaurus clear"
fi

if [ -z "$SKIP_NODE_MODULES_CLEAN" ]; then
    echo ""
    echo "Cleaning out node_modules for each package"
    if [ -z "$SKIP_SLEEP" ]; then
        echo ""
        echo "Press ctrl+c within 5 seconds to abort"
        sleep 5
    fi
    cd "${SCRIPT_DIR}"
    ./node_modules-ci.sh || exit 3
else
    echo "Skipping cleaning out node_modules for each package"
fi

# determine if we need to stash untracked files
#echo "Checking for untracked files"
#status=$(git status --porcelain)
#if [[ "$status" == *??* ]]; then
#    echo "Stashing anything changed, including untracked"
#    git stash save -u || exit 1
#    echo "You can restore your changes when the script is completed with 'git stash pop'"
#fi

# unless --skip=git_reset is passed, reset to HEAD
#if [ -z "$SKIP_GIT_RESET" ]; then
#    echo "Performing git reset --hard"
#    git reset --hard || exit 2
#else
#    echo "Skipping git reset --hard"
#fi

#echo "Checking whether everything is clean"
# warn if there are any untracked files or changes, should include unpushed commits
#gitStatus=$(git status --porcelain)
#if [ -n "$gitStatus" ]; then
#    echo "WARNING: There are untracked files or changes"
#    echo "$gitStatus"
#    exit 5
#else
#    echo "No untracked files or changes"
#fi

#echo "The repository is now at the following commit:"
#GIT_PAGER=cat git log -1 --color=always
#if [ -z "$SKIP_SLEEP" ]; then
#    echo ""
#    echo "Press ctrl+c within 5 seconds to abort"
#    sleep 5
#fi

if [ -z "$DOCKER_BUILD" ]; then
    if [ -z "$SKIP_SETUP_FA_NPM" ]; then
        ./setup-fa-npm.sh || exit 6
    else
        echo "Skipping setup-fa-npm"
    fi

    if [ -z "$SKIP_YARN" ]; then
        echo "Running yarn"
        ./yarn-all.sh --frozen-lockfiles || exit 7
    else
        echo "Skipping yarn"
    fi

    if [ -z "$SKIP_BUILD" ]; then
        if [ $productionBuild -eq 1 ]; then
            echo "We will build for production"
            echo "Running build with arguments: --production $@"
            ./build-all.sh --production $@ || exit 8
        else
            echo "Running build with arguments: $@"
            "${SCRIPT_DIR}/build-packages.sh" $@ || exit 9
        fi
    else
        echo "Skipping build"
    fi
else
    echo "Running build in docker container with arguments: $@"
    docker build $@ . || exit 10
fi
# restore the stash if we stashed anything
if [[ "$status" == *??* ]]; then
    echo "Restoring stashed changes"
    echo "If this fails because you were on a different commit, don't worry, the stash will be kept until a stash pop completes successfully"
    #git stash pop || exit 11
fi
# restore the directory we were in
cd "${OPWD}"
