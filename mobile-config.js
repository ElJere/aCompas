App.info({
  id: 'audio.acompas.app',
  name: 'A Compás',
  description: 'A Compás is a web-based flamenco metronome, available as a mobile-compatible website and as an Android application. It will let you play various flamenco rhythms and change the tempo.',
  author: 'A Compás team',
  email: 'olivier@ricordeau.org',
  website: 'http://acompas.audio',
  version: '2.0.0'
});

// Set up resources such as icons and launch screens.
App.icons({
  'android_ldpi': 'public/images/icon_36x36.png',
  'android_mdpi': 'public/images/icon_48x48.png',
  'android_hdpi': 'public/images/icon_72x72.png',
  'android_xhdpi': 'public/images/icon_96x96.png'
});

App.launchScreens({
    'android_ldpi_portrait':  'public/images/icon_48x48.png',
    'android_ldpi_landscape': 'public/images/icon_48x48.png',
    'android_mdpi_portrait':  'public/images/icon_72x72.png',
    'android_mdpi_landscape': 'public/images/icon_72x72.png',
    'android_hdpi_portrait':  'public/images/icon_144x144.png',
    'android_hdpi_landscape': 'public/images/icon_144x144.png',
    'android_xhdpi_portrait': 'public/images/icon_512x512.png',
    'android_xhdpi_landscape':'public/images/icon_512x512.png',
});

// Set PhoneGap/Cordova preferences
//App.setPreference('BackgroundColor', 'ffffff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
