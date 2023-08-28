#!/bin/bash

#  storing a ICRC Canister ID in a variable
ICRC_CANISTER_ID=$(dfx canister id icrc)
echo $ICRC_CANISTER_ID

# Deploying a ICRC Canister with Specified ID and also providing ICRC_CANISTER_ID as an environment varialble
ICRC_CANISTER_ID=$ICRC_CANISTER_ID dfx deploy  will --specified-id bkyz2-fmaaa-aaaaa-qaaaq-cai
