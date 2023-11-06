#!/bin/bash

echo "$1" "Blocks Mined for" "$2"

#  Address n2dcQfuwFw7M2UYzLfM6P7DwewsQaygb8S used to mine addtional 101 blocks

if [[ $2 == "n2dcQfuwFw7M2UYzLfM6P7DwewsQaygb8S" ]]; then

    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf generatetoaddress "$1" "$2"

else
    # Mine $1 blocks to recipient p2pkh address ($2)
    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf generatetoaddress "$1" "$2"

    # Mine additional 101 blocks on top of it to make coinbase reward spendable
    .bitcoin/bin/bitcoin-cli -conf="$(pwd)"/.bitcoin.conf generatetoaddress 101 "n2dcQfuwFw7M2UYzLfM6P7DwewsQaygb8S"

fi
