#!/bin/bash

# Change the variable to the principal that can mint and burn tokens.
dfx identity use minter
MINTER_PRINCIPAL=$(dfx identity get-principal)
export MINTER_PRINCIPAL

dfx identity use default
LEDGER_ACC=$(dfx identity get-principal)
export LEDGER_ACC

# Change the variable to the principal that controls archive canisters.
dfx identity use default
ARCHIVE_CONTROLLER=$(dfx identity get-principal)
export ARCHIVE_CONTROLLER

export TOKEN_NAME="ckBTC"
export TOKEN_SYMBOL="ckBTC"

dfx deploy ckbtc_ledger --argument \
  "(variant {Init = record { token_name = \"${TOKEN_NAME}\"; token_symbol = \"${TOKEN_SYMBOL}\"; transfer_fee = 10; \
 metadata = vec {}; minting_account = record {owner = principal \"${MINTER_PRINCIPAL}\";}; \
 initial_balances = vec {record { record {owner = principal \"${LEDGER_ACC}\"}; 100_000_000_000 } }; \
  archive_options = record {num_blocks_to_archive = 1000000; trigger_threshold = 1000000; \
  controller_id = principal  \"${ARCHIVE_CONTROLLER}\"; }}})" --specified-id mxzaz-hqaaa-aaaar-qaada-cai
