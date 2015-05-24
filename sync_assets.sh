#!/bin/bash -x

# This script copies the assets to both version of the app (web and crosswalk)


# Check that this script is called from the right place, i.e. the project's root
if [ ! -d "common" ]; then
    echo "[ERROR] This script must be called in the project's root directory"
    exit 1
fi

# Web version

rsync -av --delete ./common ./web
rsync -av --delete ./bower_components ./web

# Crosswalk version

# Fonts
rsync -av --delete --delete-excluded --exclude="common/fonts/Playball/OFL.txt" --exclude="common/audio/README" ./common ./crosswalk
# Bootstrap
mkdir -p ./crosswalk/bower_components/bootstrap/dist/{css,fonts,js}
rsync -av ./bower_components/bootstrap/dist/css/bootstrap.min.css ./crosswalk/bower_components/bootstrap/dist/css
rsync -av --delete ./bower_components/bootstrap/dist/fonts ./crosswalk/bower_components/bootstrap/dist
rsync -av ./bower_components/bootstrap/dist/js/bootstrap.min.js ./crosswalk/bower_components/bootstrap/dist/js
# jQuery
mkdir -p ./crosswalk/bower_components/jquery/dist
rsync -av ./bower_components/jquery/dist/jquery.min.js ./crosswalk/bower_components/jquery/dist
# seiyria-bootstrap-slider
mkdir -p ./crosswalk/bower_components/seiyria-bootstrap-slider/dist/css
rsync -av ./bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js ./crosswalk/bower_components/seiyria-bootstrap-slider/dist
rsync -av ./bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css ./crosswalk/bower_components/seiyria-bootstrap-slider/dist/css
# jquery-mousewheel
mkdir -p ./crosswalk/bower_components/jquery-mousewheel
rsync -av ./bower_components/jquery-mousewheel/jquery.mousewheel.min.js ./crosswalk/bower_components/jquery-mousewheel
