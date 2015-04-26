#!/bin/sh -x

rsync -av --delete ./common ./web
rsync -av --delete ./bower_components ./web
