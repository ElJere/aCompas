#!/bin/bash

apt-get update

apt-get install -y -q curl vim git

curl -sL https://deb.nodesource.com/setup | bash -

apt-get install -y -q nodejs

npm install -g bower
