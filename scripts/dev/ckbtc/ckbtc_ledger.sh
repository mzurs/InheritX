#!/bin/bash

file_name="ledger.wasm"

# Check if the file exists in the current directory
if [ -f "$file_name" ]; then
    echo "The file $file_name exists in the current directory."

else
    echo "The file $file_name does not exist in the current directory."

    export IC_VERSION=206a50f01306b398eb7e25988c7925fcd0e2caa4
    curl -o ckbtc_ledger.wasm.gz "https://download.dfinity.systems/ic/$IC_VERSION/canisters/ic-icrc1-ledger.wasm.gz"
    curl -o ckbtc_ledger.did "https://raw.githubusercontent.com/dfinity/ic/$IC_VERSION/rs/rosetta-api/icrc1/ledger/ledger.did"
    gunzip ckbtc_ledger.wasm.gz
fi

echo "Downloading latest IC Version"

echo "Adding to ckBTC Dir...."

# cp ckbtc_ledger.wasm ckbtc/
cp ckbtc_ledger.did canisters/icrc/ledgers/ckbtc/

cp ckbtc_ledger.wasm.gz canisters/icrc/ledgers/ckbtc/

cp ckbtc_ledger.wasm canisters/icrc/ledgers/ckbtc/

rm ckbtc_ledger.did
# rm ckbtc_ledger.wasm
rm ckbtc_ledger.wasm.gz

rm ckbtc_ledger.wasm