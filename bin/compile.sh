#!/bin/sh

BUILD_PATH="builds"
PROJECT_NAME=$1
GIT_URL=$2
BRANCH_NAME=$3
JACOCO_TASK=$4

if [ ! -d "$BUILD_PATH" ]; then
    mkdir "$BUILD_PATH"
fi
cd "$BUILD_PATH"

if [ ! -d "$PROJECT_NAME" ]; then
    git clone $GIT_URL
fi

cd "$PROJECT_NAME"

git reset --hard HEAD
git checkout $BRANCH_NAME
git pull

./gradlew clean build $JACOCO_TASK