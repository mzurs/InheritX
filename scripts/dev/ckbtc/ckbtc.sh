#!/bin/bash


echo "Fetching CKBTC Ledger......"

bash scripts/dev/ckbtc/ckbtc_ledger.sh


echo "Deploying CKBTC  Ledger......."

bash scripts/dev/ckbtc/ckbtc_deploy.sh

echo "Transfering ckBTC from " $(dfx identity get-principal) " to PLUG_ACCOUNT_ 1"

bash scripts/dev/ckbtc/ckbtc_transfer.sh

