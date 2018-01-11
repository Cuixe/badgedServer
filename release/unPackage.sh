#!/bin/bash

USER_PATH="/home/scnusr"
BASE_PATH="$USER_PATH/badgeServer"
PACKAGE_NAME="install.tar.gz"

createDirectories() {
    if [ ! -d "$BASE_PATH" ]; then
        echo "**********************************"
        echo "    Creando directorio base       "
        echo "**********************************"
        sleep 1
        mkdir "$BASE_PATH"
    fi
    cd $BASE_PATH
    mkdir logs
}

cleanBinaryPath() {
    if [ -d "$BASE_PATH" ]; then
        
        cd $BASE_PATH
        echo "**********************************"
        echo "   Empaquetando versión anterior  "
        echo "**********************************"
        sleep 1
        
        tar --exclude='metrics.db' --exclude="builds" --exclude="node_modules" -zcvf last.tag.gz ./*

        echo "**********************************"
        echo "     Limpiando directorios        "
        echo "**********************************"
        sleep 1

        rm -rf `ls | grep -v metrics.db`
        
    fi
}

binaryDeploy() {
    cleanBinaryPath
    createDirectories

    echo "**********************************"
    echo "          Desempaquetando         "
    echo "**********************************"
    sleep 1

    mv "$USER_PATH/$PACKAGE_NAME" "$BASE_PATH"
    cd "$BASE_PATH"
    tar -zxvf "$PACKAGE_NAME"
    echo "**********************************"
    echo "        Agregando permisos        "
    echo "**********************************"
    sleep 1
    chmod +x bin/*.sh
    mv bin/start.sh ./
    mv bin/stop.sh ./

    echo "**********************************"
    echo "      Limpiando instalación       "
    echo "**********************************"
    sleep 1
    rm -rf *.tar.gz
    mv etc/filledConfiguration.properties etc/configuration.properties

    echo "**********************************"
    echo "      Instalando dependencias     "
    echo "**********************************"
    sleep 1
    npm install

    echo "**********************************"
    echo "       Instalación Terminada      "
    echo "**********************************"
}

binaryDeploy