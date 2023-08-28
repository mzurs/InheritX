#!/bin/bash

# Storing Two Identity Principal
echo "Storing Principal of UserA and UserB"
# User A
dfx identity use userA
userA=$(dfx identity get-principal)
echo "User A ====> " $userA

# User b
dfx identity use userB
userB=$(dfx identity get-principal)
echo "User B ====> " $userB

# List all Hardcoded Variable Used in ICRC CanisterIDs
dfx canister call icrc list_canister_ids

# Switching identity to default
dfx identity use default
