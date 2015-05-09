# A Compás

A flamenco metronome available in two versions :

* Web application (available at [http://acompas.audio](http://acompas.audio)).
* Mobile application using the Cordova/PhoneGap framework, [available on the Google Play marketplace](https://play.google.com/store/apps/details?id=audio.acompas.app).

It makes use of Web Audio API to play various flamenco rhythms and features a visual animation.

## Installing the web application (the simple way)

```bash
# Clone the git repository in the current folder
git clone https://github.com/ElJere/aCompas.git
# Go inside the folder created by the previous command
cd aCompas
# Install dependencies using bower
bower install
# Synchronize assets to the web/ and cordova/ folders
./sync_assets.sh
# Run a basic web server on port 8000
./server.sh
```

Then, open your favorite web browser and go to [http://localhost:8000](http://localhost:8000)

## Installing the web application (the vagrant way)

Get the latest version of vagrant at `https://www.vagrantup.com/downloads.html`

Then in the project folder 

```bash 
# Clone the git repository in the current folder
git clone https://github.com/ElJere/aCompas.git
# Go inside the folder created by the previous command
cd aCompas
# Create and provision the vm
vagrant up --provision
# ssh into the vm
vagrant ssh
# Go inside mounted project folder
cd /vagrant
# Setup dependendencies
bower install
# Synchronize assets to the web/ and cordova/ folders
./sync_assets.sh
# Run a basic web server on port 8000
./server.sh
```

Then, in the host operating system (not inside the virtual machine), open your favorite web browser and go to [http://192.168.50.2:8000](http://192.168.50.2:8000)

## Building the mobile app for Android

```bash
# Clone the git repository in the current folder
git clone https://github.com/ElJere/aCompas.git
# Go inside the folder created by the previous command
cd aCompas
# Install dependencies using bower
bower install
# Synchronize assets to the web/ and cordova/ folders
./sync_assets.sh
# Go inside the Cordova project
cd cordova/
# Install Cordova
sudo npm install -g cordova
# Build the app
cordova build
# Run the application in the Android emulator
cordova run --emulator
```

## Credits

This application uses the following [code from Chris Wilson](https://github.com/cwilso/metronome).
Thanks to him !
