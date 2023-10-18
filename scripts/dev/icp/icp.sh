#!/bin/bash

echo "Fetching ICP Ledger......"

bash scripts/dev/icp/icp_ledger.sh

echo "Deploying ICP  Ledger......."

bash scripts/dev/icp/icp_deploy.sh

dfx identity use default