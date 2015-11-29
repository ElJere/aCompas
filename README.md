# A Compás

This application is being rewritten using the [Meteor](https://www.meteor.com) framework.

A Compás is a flamenco metronome available in two versions :

* Web application (available at [http://acompas.audio](http://acompas.audio)).
* Mobile application for Android, [available on the Google Play marketplace](https://play.google.com/store/apps/details?id=audio.acompas.app).

It uses Web Audio API to play various flamenco rhythms and features a visual animation.

## Installing the application

```bash
# Clone the git repository in the current folder
git clone https://github.com/ElJere/aCompas.git
# Go inside the folder created by the previous command
cd aCompas
# Switch to the "meteor" branch
git checkout meteor
# Install meteor (run this only once)
curl https://install.meteor.com/ | sh
# Build and run the application in development mode
meteor
```

Then, open your favorite web browser and go to [http://localhost:3000](http://localhost:3000)

## Running the mobile version using the Android simulator

First, install Java (the way to install it depends on the OS you're using).
Then, install the standalone [Android SDK](https://developer.android.com/sdk/) and set
the $ANDROID_HOME environment variable in the shell you are using
(edit ~/.bashrc to make this variable available every time you start a shell).

```bash
meteor run android
```

## Credits

* The metronome's audio core is inspired by the following [code from Chris Wilson](https://github.com/cwilso/metronome).
* The palmas sordas and jaleo sounds are recordings of Aziz Andry.
