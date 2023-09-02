#!/bin/bash

# dfx identity use default

dfx canister call ckbtc_ledger icrc1_transfer \
    '(record {  to = record {owner=principal  "be2us-64aaa-aaaaa-qaabq-cai"; 
subaccount= opt blob "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\06\1e\9f\d4"}; amount= 100_000_000 })'

dfx canister call ckbtc_ledger icrc1_balance_of '(record { owner=principal "be2us-64aaa-aaaaa-qaabq-cai"; 
subaccount= opt blob "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\06\1e\9f\d4"})'

# # dfx canister call ckbtc_ledger icrc1_balance_of  '(record { owner=principal  "up5qv-6itp6-z5fuj-kfq2a-qohj4-ckibb-lq6tt-34j2c-i2d27-3gqlm-pqe"; })'

dfx canister call icrc ckbtc_transfer '(102_670_292, principal "up5qv-6itp6-z5fuj-kfq2a-qohj4-ckibb-lq6tt-34j2c-i2d27-3gqlm-pqe")'

dfx identity use default

dfx canister call icrc getIdentifierBlob '(102_670_292)'

# echo "Transferring From ICRC default account to Identifier SubAccount......"

dfx canister call icrc transferFrom '(102_670_292)'

