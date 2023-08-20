#!/bin/bash
# export  PATH="$HOME/bin:$PATH"

# # Call the script with deploy.sh {network}
# if [[ $# -lt 1 ]]; then
#     echo "Number of arguments supplied not correct. Call this script: \
#     ./deploy.sh {env} \
#     env should be one of the networks configured in dfx.json."
#     exit 1
# fi

bash scripts/dev/icp/icp.sh

bash scripts/dev/ckbtc/ckbtc.sh

bash scripts/dev/icrc/icrc.sh
