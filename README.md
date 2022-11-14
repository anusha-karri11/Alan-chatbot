# Deloitte Restaurant Demo

## Requirements:

- node v16
- JDK 11+

## App Login:

- Login: `admin`
- Password: `P@ssw0rd`

## Alan Studio Project

- in account demo@alan.app

## Keystore problem fix:

```
cd android/app
keytool -genkeypair -v -keystore my_release_key.keystore -alias my_key_alias -keyalg RSA -keysize 2048 -validity 10000
```
- Password: `qwerty`


## Incompatible version of Kotlin fix:

check local node and jdk versions(see Requirements), then

```
rm -rf node_modules
npm i -f
npm run android
```

## Build release build
```
cd android
./gradlew assembleRelease
```

## Install release build to device
```
cd android
adb install ./app/build/outputs/apk/release/deloitte-restaurant-demo-release.apk
```

## Publish release build (App Distribution and Google backet)
```
cd android
./gradlew buildApps
```
