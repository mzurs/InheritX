#!/bin/bash

# # dfx identity new minter | true
# dfx identity use default

# dfx canister call icp_ledger icrc1_transfer \
#     '(record {  to = record {owner=principal "bd3sg-teaaa-aaaaa-qaaba-cai"; subaccount= opt blob "\a8\c8Z\1e\bb\81\da\85a4\ebm\a87\d4\eeb\d1\18\9e\f2\01\c2]\b5\0f\04g1&\ba>"}; amount= 1_000_000_000 })'

# # dfx canister call icp_ledger send_dfx '(record {memo=1 ; amount= record {e8s=400_000_000}; fee= record {e8s=10_000} ; to=
# #  "a8c85a1ebb81da856134eb6da837d4ee62d1189ef201c25db50f04673126ba3e"})'

# dfx canister call icrc getAccountBalance '(principal "bd3sg-teaaa-aaaaa-qaaba-cai",1)'

# dfx canister call icrc getSubAccountBalances '(1,blob "\a8\c8Z\1e\bb\81\da\85a4\ebm\a87\d4\eeb\d1\18\9e\f2\01\c2]\b5\0f\04g1&\ba>")'

# dfx canister call icp_ledger icrc1_balance_of '(record { owner=principal  "bd3sg-teaaa-aaaaa-qaaba-cai"; subaccount= opt blob "\a8\c8Z\1e\bb\81\da\85a4\ebm\a87\d4\eeb\d1\18\9e\f2\01\c2]\b5\0f\04g1&\ba>"})'
# # icrc_balance

# dfx canister call icrc icrc_balance '(principal "bd3sg-teaaa-aaaaa-qaaba-cai",1)'

# dfx canister call icrc icrc_icp_transfer '(principal "akm3b-xt34z-vnaos-o667b-jrxjr-3a4ao-juwz5-7qdpz-hxnks-yfh2i-fae", 1)'
