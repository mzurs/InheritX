#!/bin/bash

# dfx identity new minter | true
dfx identity use default



dfx canister call ckbtc_ledger icrc1_transfer \
'(record {  to = record {owner=principal "up5qv-6itp6-z5fuj-kfq2a-qohj4-ckibb-lq6tt-34j2c-i2d27-3gqlm-pqe"; subaccount=null}; amount= 100_000_000 })'

