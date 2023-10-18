#!/bin/bash

echo "Cleaning Up...."

if [[ $1 == "all" ]]; then

    dfx stop

    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf stop

    pkill -f "gnome-terminal"

    rm -r .bitcoin

fi


rm -rf .azle/ .dfx/

# CleanUp Bitcoin Canister 
cd canisters/bitcoin || bash

rm -rf .azle/ .dfx/

cd ../..
