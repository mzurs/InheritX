#!/bin/bash
# export  PATH="$HOME/bin:$PATH"

# Call the script with deploy.sh {network}
if [[ $# -lt 1 ]]; then
    echo "Number of arguments supplied not correct. Call this script: \
    ./deploy.sh {env} \
    env should be one of the networks configured in dfx.json."
    exit 1
fi

canister_name=$1

bash scripts/dev/$canister_name.sh


# Deploy exchange_rate and exchange_rate_assets
