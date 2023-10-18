#!/bin/bash

CANISTER_NAME="$1"

ACTION="$2"

PRINCIPAL="$3"

# rm -rf .azle/ .dfx

case $CANISTER_NAME in

"bitcoin_canister")
    if [[ $ACTION == "install" ]]; then

        cd canisters/bitcoin || true
        if dfx canister id bitcoin_canister >/dev/null 2>&1; then
            echo "Canister exists"

            dfx canister stop "nq4qv-wqaaa-aaaaf-bhdgq-cai"
            dfx canister delete "nq4qv-wqaaa-aaaaf-bhdgq-cai"

            # rm -rf .azle/ .dfx

        else
            echo "Canister Not Found"
        fi

    fi

    # rm -rf .azle/ .dfx

    WILL_CANISTER_ID=$PRINCIPAL dfx deploy bitcoin_canister --argument='(variant { Regtest })' --specified-id nq4qv-wqaaa-aaaaf-bhdgq-cai

    dfx generate bitcoin_canister
    cd ../..
    cp -r canisters/bitcoin/declarations/bitcoin_canister declarations/bitcoin_canister

    ;;

"will")

    if [[ $ACTION == "install" ]]; then

        if dfx canister id will >/dev/null 2>&1; then
            echo "Canister exists"

            dfx canister stop "22dcn-nyaaa-aaaaj-asjua-cai"
            dfx canister delete "22dcn-nyaaa-aaaaj-asjua-cai"

            rm -rf .azle/ .dfx

        else
            echo "Canister Not Found"
        fi

    fi

    ICRC_CANISTER_ID=$PRINCIPAL PROVIDERS_CANISTER_ID=$PRINCIPAL BITCOIN_CANISTER_ID=$PRINCIPAL dfx deploy will --specified-id 22dcn-nyaaa-aaaaj-asjua-cai

    dfx generate will

    ;;

"providers")

    if [[ $ACTION == "install" ]]; then

        if dfx canister id providers >/dev/null 2>&1; then
            echo "Canister exists"

            dfx canister stop "222l7-eqaaa-aaaar-aghea-cai"
            dfx canister delete "222l7-eqaaa-aaaar-aghea-cai"

            rm -rf .azle/ .dfx

        else
            echo "Canister Not Found"
        fi

    fi

    WILL_CANISTER_ID=$PRINCIPAL dfx deploy providers --specified-id 222l7-eqaaa-aaaar-aghea-cai

    dfx generate providers

    ;;

"icrc")

    if [[ $ACTION == "install" ]]; then

        if dfx canister id icrc >/dev/null 2>&1; then
            echo "Canister exists"

            dfx canister stop "aboy3-giaaa-aaaar-aaaaq-cai"
            dfx canister delete "aboy3-giaaa-aaaar-aaaaq-cai"

            rm -rf .azle/ .dfx

        else
            echo "Canister Not Found"
        fi

    fi

    WILL_CANISTER_ID=$PRINCIPAL dfx deploy icrc --specified-id aboy3-giaaa-aaaar-aaaaq-cai

    dfx generate icrc

    ;;
*)

    echo "CANISTER : " "$CANISTER_NAME" "not found"
    exit 1
    ;;
esac

echo "Canister: " "$CANISTER_NAME" " deployed!"

exit 0
