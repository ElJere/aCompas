#!/bin/sh -x

# This script starts a simple web server which will serve the web
# version of the application on http://localhost:8000


# Check that this script is called from the right place, i.e. the project's root
if [ ! -d "common" ]; then
    echo "[ERROR] This script must be called in the project's root directory"
    exit 1
fi

meteor
