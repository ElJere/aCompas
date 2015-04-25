#!/bin/bash

apt-get update
apt-get install -y -q curl vim git virtualbox-guest-dkms virtualbox-guest-utils nodejs-legacy npm
apt-get dist-upgrade -y -q
npm install -g bower
