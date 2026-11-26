#!/bin/sh
set -eu
HERE=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
if [ -z "${JAVA_HOME-}" ] || [ -z "${ANDROID_HOME-}" ]
then
  echo "apk: set JAVA_HOME and ANDROID_HOME (sh tools/apk/setup-sdk.sh <dir>)" >&2
  exit 2
fi
cd "$HERE"
npm install
rm -rf www
ZIP=${1-}
if [ -n "$ZIP" ]
then
  node build.ts --game "$ZIP"
else
  node build.ts --game
fi
if [ ! -d android ]
then
  npx cap add android
fi
npx cap sync android
node build.ts --apk
cd android
./gradlew --no-daemon -q assembleDebug
cd "$HERE"
STAMP=$(sha256sum www/build.json | cut -c 1-12)
mkdir -p artifacts
OUT="artifacts/TileEngine-${STAMP}-debug.apk"
cp android/app/build/outputs/apk/debug/app-debug.apk "$OUT"
sha256sum "$OUT"
