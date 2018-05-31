#!/bin/bash

# This file is used to generate a private key and csr for calling L2 secured applications on Apex.

# Certificate properties, with example values
COMMON_NAME="Apex L2 Cert"
ORGANIZATION_UNIT="Application Infrastructure"
ORGANIZATION_NAME=GovTech
LOCALITY_NAME=Hive
STATE_NAME=Singapore
EMAIL=wei_junyu@ida-gds.com

if [ $# -eq 2 ]
then
    FILENAME=$1
    KEYPHRASE=$2

    openssl genpkey -algorithm RSA -out ${FILENAME} -pkeyopt rsa_keygen_bits:2048 -aes256 -pass pass:${KEYPHRASE}
elif [ $# -eq 1 ]
then
    FILENAME=$1

    openssl genpkey -algorithm RSA -out ${FILENAME} -pkeyopt rsa_keygen_bits:2048
else
    echo "Generates a 2048-bit RSA private key plus CSR with specified key file name. If KEYPASS is provided, the key would be AES256-encrypted."
    echo "Usage: GenerateCsr.sh KEY_FILE_NAME [KEYPASS]"
    exit 1
fi

# Generate Signing Request
openssl req -new -sha256\
    -key ${FILENAME} \
    -out ${FILENAME}.csr \
    -passin pass:${KEYPHRASE} \
    -subj "/C=SG/ST=${STATE_NAME}/L=${LOCALITY_NAME}/O=${ORGANIZATION_NAME}/OU=${ORGANIZATION_UNIT}/CN=${COMMON_NAME}/emailAddress=${EMAIL}"
