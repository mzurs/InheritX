#!/bin/bash

# bd3sg-teaaa-aaaaa-qaaba-cai

dfx canister uninstall-code icrc

dfx deploy icrc --argument '("local")' --specified-id bd3sg-teaaa-aaaaa-qaaba-cai
