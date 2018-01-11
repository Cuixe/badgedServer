#!/bin/bash

export port=$1
export gitlabUrl=$2
export gitlabToken=$3

USER=""
HOST=""

getLastTag() {
    LAST_TAG=`git describe --tags $(git rev-list --tags --max-count=1)`
    echo "**********************************"
    echo " Obteniendo ultimo tag ${LAST_TAG}"
    echo "**********************************"
    git reset --hard HEAD
    git reset --hard origin/master
    git checkout $LAST_TAG
}

package() {
    envsubst < etc/configuration.template > etc/filledConfiguration.properties

    chmod +x release/unPackage.sh
    scp release/unPackage.sh $USER@$HOST:./

    echo "**********************************"
    echo "          Empaquetando            "
    echo "**********************************"
    sleep 1
    tar --exclude='etc/configuration.template' --exclude='.vscode' --exclude='node_modules' \
        --exclude='release' --exclude='test' --exclude='metrics.db' --exclude='build' \
        --exclude='logs' --exclude='*.log' --exclude='package-lock.json' \
        -zcvf install.tar.gz ./*
}

deploy() {
    echo "**********************************"
    echo "         Deployando jar           "
    echo "**********************************"
    sleep 1
    scp install.tar.gz $USER@$HOST:./

    ssh $USER@$HOST "./unPackage.sh"

    rm -r install.tar.gz etc/filledConfiguration.properties
}

getLastTag
package
deploy
