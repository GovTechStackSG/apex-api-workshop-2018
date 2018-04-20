#!/bin/bash

# This file is used to generate a private key and csr for calling L2 secured applications on Apex.

# Certificate properties
COMMON_NAME="Apex L2 Cert"
ORGANIZATION_UNIT="Application Infrastructure"
ORGANIZATION_NAME=Govtech
LOCALITY_NAME=Hive
STATE_NAME=Singapore

if [ $# -eq 2 ]
then
    FILENAME=$1
    KEYPHRASE=$2

    openssl genrsa -aes256 -out ${FILENAME} -passout pass:${KEYPHRASE} 2048
elif [ $# -eq 1 ]
then
    FILENAME=$1

    openssl genrsa -out ${FILENAME} 2048
else
    echo "Usage: GenerateCsr.sh KEY_FILE_NAME [KEYPASS]"
    exit 1
fi

read -p "Email: " EMAIL

# Generate Signing Request
openssl req -new \
    -key ${FILENAME} \
    -out ${FILENAME}.csr \
    -passin pass:${KEYPHRASE} \
    -sha256 -subj "/C=SG/ST=${STATE_NAME}/L=${LOCALITY_NAME}/O=${ORGANIZATION_NAME}/OU=${ORGANIZATION_UNIT}/CN=${COMMON_NAME}/emailAddress=${EMAIL}"
