#!/bin/bash

cd canisters/bitcoin || true

dfx canister uninstall-code bitcoin_canister

echo "Deploying bitcoin_canister....."

echo "WILL CANISTER ID =======>" "$1"

WILL_CANISTER_ID=$1 dfx deploy bitcoin_canister --argument='(variant { Regtest })' --specified-id nq4qv-wqaaa-aaaaf-bhdgq-cai

dfx generate bitcoin_canister

cd ../..

echo "Copying Bitcoin Declarations..."

cp -r canisters/bitcoin/declarations/bitcoin_canister declarations/bitcoin_canister
