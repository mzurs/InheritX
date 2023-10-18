#!/bin/bash

#  This Scripts is onty  used for extensive unit & integration Testing without any prior setup
# Used this script with for testing Canister

bash scripts/dev/cleanup.sh all

if [[ $1 == "no-bitcoin" ]]; then

    echo "Starting Replica without Bitcoin Node..."
    sleep 10
    gnome-terminal -- bash -c 'dfx start --clean; exec bash'

    exit 0
fi

# Check if Bitoin Core is running or not, then start it
if .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf stop >/dev/null 2>&1; then

    echo "Bitcoin Core Stopped!"
    echo "Started Bitcoin Again..."

    gnome-terminal -- bash -c 'bash scripts/dev/btc/install_bitcoind.sh start; exec bash'

else

    echo "Starting Bitcoin Core..."

    gnome-terminal -- bash -c 'bash scripts/dev/btc/install_bitcoind.sh start; exec bash'

fi

# Check if IC Replica is running or not, then start it
if dfx stop >/dev/null 2>&1; then

    echo "Replica Stopped!"
    echo "Started Replica Again..."

    sleep 10
    gnome-terminal -- bash -c 'yarn dfx_start; exec bash'

else

    echo "Starting Replica..."
    sleep 10
    gnome-terminal -- bash -c 'yarn dfx_start; exec bash'

fi
