#!/bin/sh -x

rsync -av --delete ./common ./cordova/www
rsync -av --delete ./bower_components ./cordova/www

