#!/bin/sh
set -eu
if [ "$#" -ne 1 ]
then
  echo "usage: sh tools/apk/setup-sdk.sh <dir>" >&2
  exit 2
fi
DIR=$1
mkdir -p "$DIR"
JDK_URL="https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.21.1%2B2/OpenJDK17U-jdk_x64_linux_hotspot_17.0.21.1_2.tar.gz"
JDK_SHA="0b0ac5eab6db6abaec68c9913bcddb31321e5da411c45073d520d9c125e6f7b4"
curl -fL "$JDK_URL" -o "$DIR/jdk.tar.gz"
printf '%s  %s\n' "$JDK_SHA" "$DIR/jdk.tar.gz" | sha256sum -c -
tar -xzf "$DIR/jdk.tar.gz" -C "$DIR"
CMD_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
CMD_SHA="2d2d50857e4eb553af5a6dc3ad507a17adf43d115264b1afc116f95c92e5e258"
curl -fL "$CMD_URL" -o "$DIR/cmd.zip"
printf '%s  %s\n' "$CMD_SHA" "$DIR/cmd.zip" | sha256sum -c -
mkdir -p "$DIR/android-sdk/cmdline-tools"
unzip -q "$DIR/cmd.zip" -d "$DIR/android-sdk/cmdline-tools"
mv "$DIR/android-sdk/cmdline-tools/cmdline-tools" "$DIR/android-sdk/cmdline-tools/latest"
export JAVA_HOME="$DIR/jdk-17.0.21.1+2"
export ANDROID_HOME="$DIR/android-sdk"
yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$ANDROID_HOME" --licenses
"$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$ANDROID_HOME" "platform-tools" "platforms;android-34" "build-tools;34.0.0"
echo "export JAVA_HOME=$JAVA_HOME"
echo "export ANDROID_HOME=$ANDROID_HOME"
