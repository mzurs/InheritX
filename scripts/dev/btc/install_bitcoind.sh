#!/bin/bash


cd canisters/bitcoin
rm -rf .azle/ .dfx
cd ../..

echo "Removing Bitcoin Dir.."
rm -r .bitcoin/data
rm -r .bitcoin

echo "Creating Bitcoin Dir ..."
mkdir .bitcoin
mkdir .bitcoin/data

curl https://bitcoincore.org/bin/bitcoin-core-23.0/bitcoin-23.0-x86_64-linux-gnu.tar.gz -o bitcoin.tar.gz

tar xzf bitcoin.tar.gz --overwrite --strip-components=1 --directory=.bitcoin/ bitcoin-23.0/bin/

rm -rf bitcoin.tar.gz

.bitcoin/bin/bitcoind -conf=$(pwd)/.bitcoin.conf -datadir=$(pwd)/.bitcoin/data --port=18444
