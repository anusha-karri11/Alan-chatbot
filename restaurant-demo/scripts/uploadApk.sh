#! /bin/bash
set -e

if [[ -z "$1" ]]; then
    apk_path=$(pwd)
else
    apk_path=$1
fi

uploadToBucket() {
    file=$1
    bucket=$2
    set +e
    echo gsutil cp $file $bucket
    gsutil cp $file $bucket
    gsutil_res=$?
    set -e
    if [[ ! "$gsutil_res" -eq "0" && ! -z "$GOOGLE_APPLICATION_CREDENTIALS" ]]; then
        gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
        gsutil cp $file $bucket
    fi
}

set +e
branch=${BRANCH:-`git symbolic-ref --short HEAD`}
branch_res=$?
set -e
if [[ ! "$branch_res" -eq 0 ]]; then
    branch=unknown
fi

addTimestampAndUpload() {
    filepath=$1
    filename=$(basename -- "$filepath")
    extension="${filename##*.}"
    filename="${filename%.*}"
    timestamp=$(date +"%Y%m%d-%H%M")
    uploadToBucket $filepath gs://android-app-distribution/$branch/$filename-$timestamp.$extension
}
export -f addTimestampAndUpload

for i in $(find $apk_path -name *.apk); do
    addTimestampAndUpload "$i"
done

