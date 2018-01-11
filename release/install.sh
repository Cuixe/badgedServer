#!/bin/bash

USER=""
HOST=""

printMessage() {
    LENGHT=40
    REMAIN=$(($((LENGHT - ${#1})) / 2 ))
    SPACES=""
    ASTERICS=""
    for (( c=1; c<=$LENGHT; c++ )); do
        ASTERICS=$ASTERICS"*"
    done
    for (( c=1; c<=$REMAIN; c++ )); do
        SPACES=$SPACES" "
    done
    echo "$ASTERICS"
    echo "$SPACES$1"
    echo "$ASTERICS"
    sleep 1
}

getLastTag() {
    LAST_TAG=`git describe --tags $(git rev-list --tags --max-count=1)`
    printMessage "Obteniendo tag ${LAST_TAG}"
    git reset --hard HEAD
    git reset --hard origin/master
    git checkout $LAST_TAG
}

package() {
    printMessage "Reemplazando parametros"
    envsubst < etc/configuration.template > etc/filledConfiguration.properties

    chmod +x release/unPackage.sh
    scp release/unPackage.sh $USER@$HOST:./

    printMessage "Empaquetando"
    tar --exclude='etc/configuration.template' --exclude='.vscode' --exclude='node_modules' \
        --exclude='release' --exclude='test' --exclude='metrics.db' --exclude='build' \
        --exclude='logs' --exclude='*.log' --exclude='package-lock.json' \
        -zcvf install.tar.gz ./*
}

deploy() {
    printMessage "Deployando jar"
    scp install.tar.gz $USER@$HOST:./

    ssh $USER@$HOST "./unPackage.sh"

    rm -r install.tar.gz etc/filledConfiguration.properties
}
if [ $# -lt 3 ]; then
    echo "In order to install the aplication we need few parameters"
    echo "1.- port that should be use by the app"
    echo "2.- URL from git server"
    echo "3.- user token in order to get acces to app information"
    echo "4.- if you want to install your current source code pass LOCAL, otherwise don't pass anything"
else 
    export port=$1
    export gitlabUrl=$2
    export gitlabToken=$3
    if [ "$4" != "LOCAL" ]; then
        getLastTag
    fi
    package
    deploy
fi
