#!/bin/bash


echo "Fetching CKBTC Ledger......"

bash scripts/dev/ckbtc/ckbtc_ledger.sh


echo "Deploying CKBTC  Ledger......."

bash scripts/dev/ckbtc/ckbtc_deploy.sh

