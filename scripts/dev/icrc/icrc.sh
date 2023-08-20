#!/bin/bash

echo "Deploying ICRC Canister ...."

bash scripts/dev/icrc/icrc_deploy.sh

dfx identity use default

export ckBTC_OWNER=$(dfx identity get-principal)
export ICRC_CANISTER_ID=$(dfx canister id icrc)

echo $ckBTC_OWNER
echo $ICRC_CANISTER_ID
# // Transfer to icrc canister id
echo "Transfering ckBTC to ICRC Canister ID" $ICRC_CANISTER_ID

#  Just for test
dfx canister call ckbtc_ledger icrc1_transfer \
    '(record {  to = record {owner=principal  "bd3sg-teaaa-aaaaa-qaaba-cai"; subaccount= opt blob "\a8\c8Z\1e\bb\81\da\85a4\ebm\a87\d4\eeb\d1\18\9e\f2\01\c2]\b5\0f\04g1&\ba>" }; amount= 10_000_000 })'

dfx canister call icrc ckbtc_transfer '(1, principal "fozjk-zvlft-ubpd3-r5gbm-edhvu-vqgwh-jzkxz-wsmbc-xmrw5-xm3tj-vae")'
