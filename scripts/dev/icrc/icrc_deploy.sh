#!/bin/bash

#  storing a Will Canister ID in a variable
# WILL_CANISTER_ID=$(dfx canister id will)
# echo $WILL_CANISTER_ID

# # Deploying a ICRC Canister with Specified ID and also providing WILL_CANISTER_ID as an environment varialble
# WILL_CANISTER_ID=$WILL_CANISTER_ID 
dfx deploy icrc --specified-id be2us-64aaa-aaaaa-qaabq-cai

