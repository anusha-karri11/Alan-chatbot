FROM debian:10

RUN apt-get update && apt-get install -y software-properties-common wget curl zip unzip git python ninja-build
RUN apt-add-repository 'deb http://security.debian.org/debian-security stretch/updates main'
RUN apt-get update
RUN apt-get install -y openjdk-11-jdk

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

ENV CMDLINE_TOOLS_FILENAME=commandlinetools-linux-6200805_latest.zip
ENV CMDLINE_TOOLS_DIR=/root/android/cmdline-tools/latest

WORKDIR /root
RUN wget https://dl.google.com/android/repository/$CMDLINE_TOOLS_FILENAME && \
    unzip commandlinetools-linux-6200805_latest.zip && \
    mkdir -p $CMDLINE_TOOLS_DIR && \
    mv tools/* $CMDLINE_TOOLS_DIR && \
    rmdir tools && \
    rm $CMDLINE_TOOLS_FILENAME

ENV ANDROID_SDK_ROOT="/root/android"
ENV ANDROID_HOME=":$ANDROID_SDK_ROOT/cmdline-tools/latest"
ENV ANDROID_NDK_HOME="$ANDROID_SDK_ROOT/ndk/$NDK_VER"
ENV PATH="$PATH:$ANDROID_HOME/bin:$ANDROID_HOME/lib:$ANDROID_HOME/platform-tools"

RUN dir="$(ls /usr/lib/jvm/)" && echo $dir

RUN export JAVA_HOME=$(readlink -f /usr/bin/javac | sed "s:/bin/javac::")

ENV NDK_VER=24.0.8215888

RUN yes | sdkmanager --licenses
RUN sdkmanager --install "ndk;$NDK_VER" 
RUN sdkmanager --install "platforms;android-31" 
RUN sdkmanager --install "build-tools;31.0.0"

ENV GRADLE_VER=7.3.3

RUN wget https://services.gradle.org/distributions/gradle-$GRADLE_VER-bin.zip && \
    unzip -d /opt/gradle gradle-$GRADLE_VER-bin.zip && \
    rm gradle-$GRADLE_VER-bin.zip

ENV PATH=$PATH:/opt/gradle/gradle-$GRADLE_VER/bin

# Downloading gcloud package
RUN curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz

# Installing the package
RUN mkdir -p /usr/local/gcloud \
  && tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz \
  && /usr/local/gcloud/google-cloud-sdk/install.sh

# Adding the package path to local
ENV PATH $PATH:/usr/local/gcloud/google-cloud-sdk/bin

COPY Deloitte /app/Deloitte
COPY AlanSDK_Native/AlanSDK_Android/config /app/config

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/config/alan-270581-6c38e903e5e3.json
ENV NODE_OPTIONS=--max_old_space_size=8192

WORKDIR /app/Deloitte/restaurant-demo/android
RUN cd ./app && keytool -genkeypair -v -keystore my_release_key.keystore -alias my_key_alias -keyalg RSA -keysize 2048 -validity 10000 -dname "cn=Unknown, ou=Unknown, o=Unknown, c=Unknown" -storepass qwerty -keypass qwerty
RUN cd ../ && npm install --force
RUN gradle :buildApps --no-daemon
