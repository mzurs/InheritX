#!/bin/bash

# dfx identity new minter | true
dfx identity use default

dfx canister call ckbtc_ledger icrc1_transfer \
    '(record {  to = record {owner=principal "bd3sg-teaaa-aaaaa-qaaba-cai"; subaccount= opt blob "\a8\c8Z\1e\bb\81\da\85a4\ebm\a87\d4\eeb\d1\18\9e\f2\01\c2]\b5\0f\04g1&\ba>"}; amount= 100_000_000 })'

dfx canister call ckbtc_ledger icrc1_balance_of '(record { owner=principal  "bd3sg-teaaa-aaaaa-qaaba-cai"; subaccount= opt blob "\a8\c8Z\1e\bb\81\da\85a4\ebm\a87\d4\eeb\d1\18\9e\f2\01\c2]\b5\0f\04g1&\ba>"})'

# dfx canister call ckbtc_ledger icrc1_balance_of  '(record { owner=principal  "up5qv-6itp6-z5fuj-kfq2a-qohj4-ckibb-lq6tt-34j2c-i2d27-3gqlm-pqe"; })'

dfx canister call icrc ckbtc_transfer '(1, principal "up5qv-6itp6-z5fuj-kfq2a-qohj4-ckibb-lq6tt-34j2c-i2d27-3gqlm-pqe")'
