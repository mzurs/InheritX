#!/bin/bash

# # dfx identity new minter | true
# dfx identity use default

dfx canister call icp_ledger icrc1_transfer '(record {  to = record {owner=principal "qau4k-6osox-t727t-hrq3n-tbrbv-jkaqx-2wens-2odhg-rok3u-bi7y7-aae"; subaccount= opt  blob "g\c7\a1h\1c\cb\19F\97\1e.\d4%!\0c8\15f\db\0c.Z\ac\be\b1Y\bc\f1\d3\03V\9c"}; amount= 1_000_000 })'

dfx canister call icp_ledger send_dfx '(record {memo=1 ; amount= record {e8s=300_000_000}; fee= record {e8s=10_000} ; to=
 "c731ebac8bec39ecebc26ea05142a8712d8498e60373c109011b7a619840ac1f"})'

# dfx canister call icrc getAccountBalance '(principal "bd3sg-teaaa-aaaaa-qaaba-cai",1)'

# dfx canister call icrc getSubAccountBalances '(1,blob "\a8\c8Z\1e\bb\81\da\85a4\ebm\a87\d4\eeb\d1\18\9e\f2\01\c2]\b5\0f\04g1&\ba>")'

dfx canister call icp_ledger icrc1_balance_of '(record { owner=principal  "bd3sg-teaaa-aaaaa-qaaba-cai"; subaccount= opt blob "g\c7\a1h\1c\cb\19F\97\1e.\d4%!\0c8\15f\db\0c.Z\ac\be\b1Y\bc\f1\d3\03V\9c"})'
# # icrc_balance

# dfx canister call icrc icrc_balance '(principal "bd3sg-teaaa-aaaaa-qaaba-cai",1)'

# dfx canister call icrc icrc_icp_transfer '(principal "akm3b-xt34z-vnaos-o667b-jrxjr-3a4ao-juwz5-7qdpz-hxnks-yfh2i-fae", 1)'

dfx canister call icp_ledger transfer '(record {amount= record {e8s=200_000_000}; fee =record {e8s=10_000}; to = blob  "g\c7\a1h\1c\cb\19F\97\1e.\d4%!\0c8\15f\db\0c.Z\ac\be\b1Y\bc\f1\d3\03V\9c" ; memo=0 })'
