# aCompas

A flamenco metronome for the Web.
This web app makes use of Web Audio API to play various flamenco rhythms with visual animation.

## Install

Get the latest version of vagrant at `https://www.vagrantup.com/downloads.html`

Then in the project folder 

```bash 
# create and provision the vm
vagrant up --provision

# ssh into the vm
vagrant ssh

# go inside mounted project folder
cd /vagrant

# setup dependendencies
bower install

# run a webserver on port 8000
python -m SimpleHTTPServer 8000

# open your browser at
open http://192.168.50.2:8000/
 
```

## Credits

This application uses the [original code of Chris Wilson](https://github.com/cwilso/metronome)
Thanks to him
