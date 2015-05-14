#!/bin/sh -x

# This script takes a screenshot and dumps it as ./screenshot.png

adb shell /system/bin/screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png screenshot.png
