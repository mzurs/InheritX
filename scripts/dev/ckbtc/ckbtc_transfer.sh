#!/bin/bash

# # dfx identity new minter | true
# dfx identity use default

dfx canister call ckbtc_ledger icrc1_transfer \
    '(record {  to = record {owner=principal  "qau4k-6osox-t727t-hrq3n-tbrbv-jkaqx-2wens-2odhg-rok3u-bi7y7-aae"}; amount= 100_000_000 })'

# dfx canister call ckbtc_ledger icrc1_balance_of '(record { owner=principal  "be2us-64aaa-aaaaa-qaabq-cai"; 
# subaccount= opt blob "^\f6\1d:\f6\96\81\9b\d6\dc\10\98\caL\fa\fa\f03\15T \a5\b8\e9\0e\ea}\01\d5\fa\fa\07"})'

# # dfx canister call ckbtc_ledger icrc1_balance_of  '(record { owner=principal  "up5qv-6itp6-z5fuj-kfq2a-qohj4-ckibb-lq6tt-34j2c-i2d27-3gqlm-pqe"; })'

# dfx canister call icrc ckbtc_transfer '(1, principal "up5qv-6itp6-z5fuj-kfq2a-qohj4-ckibb-lq6tt-34j2c-i2d27-3gqlm-pqe")'
