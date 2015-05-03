#!/bin/sh -x

# This script copies the assets to both version of the app (web and cordova)


# Check that this script is called from the right place, i.e. the project's root
if [ ! -d "common" ]; then
    echo "[ERROR] This script must be called in the project's root directory"
    exit 1
fi

# Web version
rsync -av --delete ./common ./web
rsync -av --delete ./bower_components ./web

# Cordova version
rsync -av --delete ./common ./cordova/www
rsync -av --delete ./bower_components ./cordova/www

