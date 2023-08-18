#!/bin/bash



dfx identity use default
# Change the variable to the principal that can mint and burn tokens.
export MINTER_PRINCIPAL=$(dfx identity get-principal)

# Change the variable to the principal that controls archive canisters.
export ARCHIVE_CONTROLLER=$(dfx identity get-principal)

export TOKEN_NAME="ckBTC"
export TOKEN_SYMBOL="ckBTC"


dfx deploy ckbtc_ledger --argument \
  "(variant {Init = record { token_name = \"${TOKEN_NAME}\"; token_symbol = \"${TOKEN_SYMBOL}\"; transfer_fee = 1_000_000; \
 metadata = vec {}; minting_account = record {owner = principal \"${MINTER_PRINCIPAL}\";}; \
 initial_balances = vec {record { record {owner = principal \"${ARCHIVE_CONTROLLER}\"}; 100_000_000_000 } }; \
  archive_options = record {num_blocks_to_archive = 1000000; trigger_threshold = 1000000; \
  controller_id = principal  \"${ARCHIVE_CONTROLLER}\"; }}})"  --specified-id b77ix-eeaaa-aaaaa-qaada-cai
