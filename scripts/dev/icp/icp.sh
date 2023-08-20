#!/bin/bash

echo "Fetching ICP Ledger......"

bash scripts/dev/icp/icp_ledger.sh

echo "Deploying ICP  Ledger......."

bash scripts/dev/icp/icp_deploy.sh

echo "Transfering ICP from " $(dfx identity get-principal) " to PLUG_ACCOUNT_ 1"

bash scripts/dev/icp/icp_transfer.sh
