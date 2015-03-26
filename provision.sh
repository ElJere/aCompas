#!/bin/bash

sudo add-apt-repository ppa:chris-lea/node.js
apt-get update
apt-get install -y -q curl vim git virtualbox-guest-dkms virtualbox-guest-utils nodejs
apt-get dist-upgrade -u -q
npm install -g bower
