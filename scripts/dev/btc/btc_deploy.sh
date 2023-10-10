

cd canisters/bitcoin

echo "Deploying bitcoin_canister....."

dfx deploy bitcoin_canister --argument='(variant { Regtest })' --specified-id nq4qv-wqaaa-aaaaf-bhdgq-cai

cd ../..