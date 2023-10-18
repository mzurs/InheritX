#!/bin/bash

if [[ $1 == "upgrade" ]]; then

    # Deploying Canister
    echo "Deploying Canister..."

    ICRC_CANISTER_ID=aboy3-giaaa-aaaar-aaaaq-cai PROVIDERS_CANISTER_ID=222l7-eqaaa-aaaar-aghea-cai BITCOIN_CANISTER_ID=nq4qv-wqaaa-aaaaf-bhdgq-cai dfx deploy will --specified-id 22dcn-nyaaa-aaaaj-asjua-cai
    WILL_CANISTER_ID=22dcn-nyaaa-aaaaj-asjua-cai dfx deploy providers --specified-id 222l7-eqaaa-aaaar-aghea-cai
    WILL_CANISTER_ID=22dcn-nyaaa-aaaaj-asjua-cai dfx deploy icrc --specified-id aboy3-giaaa-aaaar-aaaaq-cai

    cd canisters/bitcoin || true
    WILL_CANISTER_ID="22dcn-nyaaa-aaaaj-asjua-cai" dfx deploy bitcoin_canister --argument='(variant { Regtest })' --specified-id nq4qv-wqaaa-aaaaf-bhdgq-cai
    cd ../..

    echo "Canister Upgraded..!"

    exit 0

elif [[ $1 == "reinstall" ]]; then

    # Stopping Canisters
    dfx canister stop "mxzaz-hqaaa-aaaar-qaada-cai"
    dfx canister stop "ryjl3-tyaaa-aaaaa-aaaba-cai"
    dfx canister stop "aboy3-giaaa-aaaar-aaaaq-cai"
    dfx canister stop "22dcn-nyaaa-aaaaj-asjua-cai"
    dfx canister stop "222l7-eqaaa-aaaar-aghea-cai"
    dfx canister stop "nq4qv-wqaaa-aaaaf-bhdgq-cai"

    # Deleting Canisters
    dfx canister delete "mxzaz-hqaaa-aaaar-qaada-cai"
    dfx canister delete "ryjl3-tyaaa-aaaaa-aaaba-cai"
    dfx canister delete "aboy3-giaaa-aaaar-aaaaq-cai"
    dfx canister delete "22dcn-nyaaa-aaaaj-asjua-cai"
    dfx canister delete "222l7-eqaaa-aaaar-aghea-cai"
    dfx canister delete "nq4qv-wqaaa-aaaaf-bhdgq-cai"

    # Cleaning Up..."
    bash scripts/dev/cleanup.sh

    # Uninstalling All Canisters
    echo "Uninstalling Canisters"
    dfx canister uninstall-code ckbtc_ledger || true
    dfx canister uninstall-code icp_ledger || true
    dfx canister uninstall-code providers || true
    dfx canister uninstall-code icrc || true
    dfx canister uninstall-code will || true

    cd canisters/bitcoin || true
    dfx canister uninstall-code bitcoin_canister
    cd ../..

    # Deploying Canister
    echo "Deploying Canister"

    bash scripts/dev/icp/icp.sh
    bash scripts/dev/ckbtc/ckbtc.sh

    ICRC_CANISTER_ID=aboy3-giaaa-aaaar-aaaaq-cai PROVIDERS_CANISTER_ID=222l7-eqaaa-aaaar-aghea-cai BITCOIN_CANISTER_ID=nq4qv-wqaaa-aaaaf-bhdgq-cai dfx deploy will --specified-id 22dcn-nyaaa-aaaaj-asjua-cai
    WILL_CANISTER_ID=22dcn-nyaaa-aaaaj-asjua-cai dfx deploy providers --specified-id 222l7-eqaaa-aaaar-aghea-cai
    WILL_CANISTER_ID=22dcn-nyaaa-aaaaj-asjua-cai dfx deploy icrc --specified-id aboy3-giaaa-aaaar-aaaaq-cai

    cd canisters/bitcoin || true
    WILL_CANISTER_ID="22dcn-nyaaa-aaaaj-asjua-cai" dfx deploy bitcoin_canister --argument='(variant { Regtest })' --specified-id nq4qv-wqaaa-aaaaf-bhdgq-cai
    cd ../..

    # Generating Declarations
    echo "Generating Declarations"
    dfx generate ckbtc_ledger
    dfx generate icp_ledger
    dfx generate providers
    dfx generate icrc
    dfx generate will

    cd canisters/bitcoin || true
    dfx generate bitcoin_canister
    cd ../..
    cp -r canisters/bitcoin/declarations/bitcoin_canister declarations/bitcoin_canister

    echo "Canister Reinstalled...!"

    exit 0

elif [[ $1 == "install" ]]; then

    # Cleaning Up..."
    bash scripts/dev/cleanup.sh

    # Uninstalling All Canisters
    echo "Uninstalling Canisters"
    dfx canister uninstall-code ckbtc_ledger || true
    dfx canister uninstall-code icp_ledger || true
    dfx canister uninstall-code providers || true
    dfx canister uninstall-code icrc || true
    dfx canister uninstall-code will || true

    cd canisters/bitcoin || true
    dfx canister uninstall-code bitcoin_canister
    cd ../..

    # Deploying Canister
    echo "Deploying Canister"

    bash scripts/dev/icp/icp.sh
    bash scripts/dev/ckbtc/ckbtc.sh

    ICRC_CANISTER_ID=aboy3-giaaa-aaaar-aaaaq-cai PROVIDERS_CANISTER_ID=222l7-eqaaa-aaaar-aghea-cai BITCOIN_CANISTER_ID=nq4qv-wqaaa-aaaaf-bhdgq-cai dfx deploy will --specified-id 22dcn-nyaaa-aaaaj-asjua-cai
    WILL_CANISTER_ID=22dcn-nyaaa-aaaaj-asjua-cai dfx deploy providers --specified-id 222l7-eqaaa-aaaar-aghea-cai
    WILL_CANISTER_ID=22dcn-nyaaa-aaaaj-asjua-cai dfx deploy icrc --specified-id aboy3-giaaa-aaaar-aaaaq-cai

    cd canisters/bitcoin || true
    WILL_CANISTER_ID="22dcn-nyaaa-aaaaj-asjua-cai" dfx deploy bitcoin_canister --argument='(variant { Regtest })' --specified-id nq4qv-wqaaa-aaaaf-bhdgq-cai
    cd ../..

    # Generating Declarations
    echo "Generating Declarations"
    dfx generate ckbtc_ledger
    dfx generate icp_ledger
    dfx generate providers
    dfx generate icrc
    dfx generate will

    cd canisters/bitcoin || true
    dfx generate bitcoin_canister
    cd ../..
    cp -r canisters/bitcoin/declarations/bitcoin_canister declarations/bitcoin_canister

    echo "Canister Deployed...!"

    exit 0

else

    echo -e "Please provide argument...! \nHint: install, reinstall, or upgrade..."
fi
