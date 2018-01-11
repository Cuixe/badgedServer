#!/bin/bash

USER=""
USER_PATH="/home/$USER"
BASE_PATH="$USER_PATH/badgeServer"
PACKAGE_NAME="install.tar.gz"

createDirectories() {
    if [ ! -d "$BASE_PATH" ]; then
        printMessage "Creando directorio Base"
        mkdir "$BASE_PATH"
    fi

    if [ ! -d "$BASE_PATH/lastInstalation" ]; then
        printMessage "Creando directorio respaldo"
        mkdir $BASE_PATH/lastInstalation
    fi

    cd $BASE_PATH
}

cleanBinaryPath() {
    if [ -d "$BASE_PATH" ]; then
        cd $BASE_PATH

        printMessage "Empaquetando versión anterior"
        tar --exclude='metrics.db' --exclude="builds" --exclude="node_modules" -zcvf last.tag.gz ./*
        mv last.tag.gz $BASE_PATH/lastInstalation

        printMessage "Limpiando directorios"
        rm -rf `ls | grep -v metrics.db | grep -v lastInstalation`
        mkdir $BASE_PATH/logs
        
    fi
}

binaryDeploy() {
    cleanBinaryPath
    createDirectories

    printMessage "Desempaquetando"
    mv "$USER_PATH/$PACKAGE_NAME" "$BASE_PATH"
    cd "$BASE_PATH"
    tar -zxvf "$PACKAGE_NAME"

    printMessage "Agregando permisos"
    chmod +x bin/*.sh
    mv bin/start.sh ./
    mv bin/stop.sh ./

    printMessage "Limpiando instalación"
    rm -rf *.tar.gz
    mv etc/filledConfiguration.properties etc/configuration.properties

    printMessage "Instalando dependencias"
    npm install

    printMessage "Reiniciando Instancia"
    cd $BASE_PATH
    ./stop.sh
    ./start.sh
    printMessage "Instalación Terminada"
}

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

binaryDeploy