#!/bin/bash

export IC_VERSION=d87954601e4b22972899e9957e800406a0a6b929

# other method
# curl -o ledger.wasm.gz https://download.dfinity.systems/ic/$IC_VERSION/canisters/ledger-canister_notify-method.wasm.gz


# new method
curl -o ledger.wasm.gz https://download.dfinity.systems/ic/$IC_VERSION/canisters/ledger-canister.wasm.gz
# curl -o ledger.did https://raw.githubusercontent.com/dfinity/ic/$IC_VERSION/rs/rosetta-api/icp_ledger/ledger.did
 
echo "Downloading latest IC Version"

echo "Adding to ICP Dir...."

cp ledger.wasm.gz canisters/icrc/ledgers/icp/
# cp ledger.public.did canisters/icrc/ledgers/icp/

gunzip ledger.wasm.gz

cp ledger.wasm canisters/icrc/ledgers/icp/


rm ledger.wasm
# rm ledger.public.did