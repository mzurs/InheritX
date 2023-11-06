#!/usr/bin/bash

if [[ $1 == "create" ]]; then

    echo "Creating Bitcoin Wallet on Regtest Network..."

    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf createwallet "testwallet"
    # .bitcoin/bin/bitcoin-cli --conf="$(pwd)"/.bitcoin.conf loadwallet testwallet

elif [[ $1 == "wallet_info" ]]; then

    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf -rpcwallet=testwallet getwalletinfo

elif [[ $1 == "new_address" ]]; then

    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf -rpcwallet=testwallet getnewaddress "" legacy

elif [[ $1 == "wallet_list" ]]; then

    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf -rpcwallet=testwallet listaddressgroupings

elif [[ $1 == "send" ]]; then

    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf -rpcwallet=testwallet sendtoaddress "$2" "$3" "drinks" "room77" true true null "unset" null 1.1

elif [[ $1 == "mine" ]]; then

    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf -rpcwallet=testwallet generatetoaddress 101 "$2"

elif [[ $1 == "balance" ]]; then

    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf -rpcwallet=testwallet getbalance

elif [[ $1 == "mine_block" ]]; then

    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf -rpcwallet=testwallet generatetoaddress 1 mq42nonp2JVeVN6RCRCgfrEutDSxij4cqR

fi
