#!/bin/bash

SUBJECT=""
LAST_TAG=""
NEXT_VERSION=""

getReleaseType() {
    echo "**********************************"
    echo "   Obteniendo tipo de liberacion  "
    echo "**********************************"
    if [ `echo $SUBJECT | grep -c "fix-"` -ge 1 ]; then
        return 4
    elif [ `echo $SUBJECT | grep -c "hotfix-"` -ge 1 ]; then
        return 4
    elif [ `echo $SUBJECT | grep -c "minor-"` -ge 1 ]; then
        return 3
    elif [ `echo $SUBJECT | grep -c "feature-"` -ge 1 ]; then
        return 2
    elif [ `echo $SUBJECT | grep -c "release-"` -ge 1 ]; then
        return 1
    else
        return 0
    fi
}

getNextVersion() {
    echo "**********************************"
    echo "   Generando siguiente Version    "
    echo "**********************************"
    getReleaseType
    RELEASE_TYPE=$?
    IFS='.' read -ra ADDR <<< "$LAST_TAG"
    if [ $RELEASE_TYPE == 4 ]; then
        NEXT=1
        if [ ! -d "${ADDR[3]}" ]; then
            NEXT=$((${ADDR[3]} + 1))
        fi
        NEXT_VERSION="${ADDR[0]}.${ADDR[1]}.${ADDR[2]}.${NEXT}"
    elif [ $RELEASE_TYPE == 3 ]; then
        NEXT=1
        if [ ! -d "${ADDR[2]}" ]; then
            NEXT=$((${ADDR[2]} + 1))
        fi
        NEXT_VERSION="${ADDR[0]}.${ADDR[1]}.${NEXT}.0"
    elif [ $RELEASE_TYPE == 2 ]; then
        NEXT=1
        if [ ! -d "${ADDR[1]}" ]; then
            NEXT=$((${ADDR[1]} + 1))
        fi
        NEXT_VERSION="${ADDR[0]}.${NEXT}.0.0"
    elif [ $RELEASE_TYPE == 1 ]; then
        NEXT=1
        if [ ! -d "${ADDR[0]}" ]; then
            NEXT=$((${ADDR[0]} + 1))
        fi
        NEXT_VERSION="${NEXT}.0.0.0"
    fi
}

createTag() {
    echo "**********************************"
    echo "        Creando Tag de git        "
    echo "**********************************"

    git reset --hard HEAD
    git reset --hard origin/master
    git checkout master
    git pull

    export SSH_PUSH_REPO=`echo $CI_BUILD_REPO | perl -pe 's#.*@(.+?(\:\d+)?)/#git@\1:#'`
    git remote set-url --push origin "$SSH_PUSH_REPO"

    echo "Repository: ${SSH_PUSH_REPO}"
    git tag -a ${NEXT_VERSION} -m "New version ${NEXT_VERSION}"
    git push origin ${NEXT_VERSION}

}

release() {
    SUBJECT=`git log -1 --pretty=%s`
    LAST_TAG=`git describe --tags $(git rev-list --tags --max-count=1)`
    if [ `echo $SUBJECT | grep -c "Merge branch"` -ge 1 ]; then
        getNextVersion
        if [ -d "${NEXT_VERSION}" ]; then
            echo "Prefijo invalido, validos: fix-, hotfix-, minor-, feature-, release-"
            return 1
        else
            createTag
            echo "Tag anterior: $LAST_TAG"
            echo "Nuevo Tag: $NEXT_VERSION"
            return 0
        fi
    fi
}
release
exit $?
