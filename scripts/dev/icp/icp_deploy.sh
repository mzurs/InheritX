#!/bin/bash

# Switching to Minter Identity
echo -e "\n Switching identity to Minter Princicpal......"

dfx identity new minter || true
dfx identity use minter
MINT_ACC=$(dfx ledger account-id)
export MINT_ACC

dfx identity use default
LEDGER_ACC=$(dfx ledger account-id)
export LEDGER_ACC

# Change the variable to the principal that controls archive canisters.
dfx identity use default
ARCHIVE_CONTROLLER=$(dfx identity get-principal)
export ARCHIVE_CONTROLLER

export TOKEN_NAME="ICP"
export TOKEN_SYMBOL="ICP"

dfx canister uninstall-code icp_ledger || true

dfx identity use default

dfx deploy icp_ledger --argument "(variant {Init =record {minting_account = \"${MINT_ACC}\";
initial_values = vec { record {  \"${LEDGER_ACC}\";
record { e8s=100_000_000_000 } } } ; archive_options = opt record {num_blocks_to_archive = 1000000; trigger_threshold = 1000000; \
  controller_id = principal  \"${ARCHIVE_CONTROLLER}\"; }; send_whitelist = vec {}}})" --specified-id ryjl3-tyaaa-aaaaa-aaaba-cai
