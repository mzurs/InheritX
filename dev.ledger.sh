#!/bin/bash

file_name="ledger.wasm"

# Check if the file exists in the current directory
if [ -f "$file_name" ]; then
    echo "The file $file_name exists in the current directory."

else
    echo "The file $file_name does not exist in the current directory."

    export IC_VERSION=3bcccef07408921fe849c92dd2437adc157ef9c3
    curl -o ledger.wasm.gz "https://download.dfinity.systems/ic/$IC_VERSION/canisters/ic-icrc1-ledger.wasm.gz"
    curl -o ledger.did "https://raw.githubusercontent.com/dfinity/ic/$IC_VERSION/rs/rosetta-api/icrc1/ledger/icrc1.did"
    gunzip ledger.wasm.gz
    rm -rf ledger.wasm.gz
fi

echo "Downloading latest IC Version"




echo "Adding to ckBTC Dir...."

cp ledger.wasm ckbtc/
cp ledger.did ckbtc/
