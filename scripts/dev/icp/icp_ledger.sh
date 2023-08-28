#!/bin/bash

export IC_VERSION=3bcccef07408921fe849c92dd2437adc157ef9c3

curl -o ledger.wasm.gz https://download.dfinity.systems/ic/$IC_VERSION/canisters/ledger-canister_notify-method.wasm.gz

echo "Downloading latest IC Version"

echo "Adding to ICP Dir...."

cp ledger.wasm.gz canisters/icrc/ledgers/icp/

gunzip ledger.wasm.gz

cp ledger.wasm canisters/icrc/ledgers/icp/


rm ledger.wasm