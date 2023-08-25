#!/bin/bash

# ===========================================USERS FUNCTIONS===================================================

echo "================================================== USERS FUNCTIONS =========================================="

# User A
dfx identity use userA
userA=$(dfx identity get-principal)
echo "User A ====> " $userA

# User b
dfx identity use userB
userB=$(dfx identity get-principal)
echo "User B ====> " $userB

echo -e "\n Creating a user with Details of User A =====> " $userA

# Adding User Details
dfx identity use userA
dfx canister call will add_user_details '(record 
{ firstNames= vec{"Claudin";"Paulette"};
  lastName= "Thiebaut";
  sex= "M";
  birthDate= "19350728";
  birthLocationCode= "78018";
})'

# Get User Details
dfx identity use userA
dfx canister call will get_user_details

# Update User Details

echo -e "\n Updating Information of User A =====> " $userA
dfx identity use userA
dfx canister call will update_user_details '(record 
{ firstNames= vec{"Claudine";"Paulette"};
  lastName= "Thiebaut";
  sex= "F";
  birthDate= "19350728";
  birthLocationCode= "78018";
})'

dfx canister call will get_user_details

# ====================================================== WILL FUNCTIONS ==========================================

echo -e "\n================================================== WILL FUNCTIONS =========================================="

echo -e "\n.................Reuesting Random Will Identifier....................."
dfx identity use userA
Identifier=$(dfx canister call will request_random_will_identifier)
echo "Random Identifier = " $Identifier

echo -e "\n.................Creating ICRC WIll FUnctions....."
echo "Creating ICRC Will from UserA to UserB with Identifier " $Identifier
dfx identity use userA
dfx canister call will icrc_create_will "( record { willName= \"Transfer_to_UserB\" ;
  identifier= $Identifier; heirs= principal \"$userB\" ;  will_type = \"ICP\"; amount = 100; })"

# Get All Wills Created By Testator
echo -e "\nList of All Wills Created By Testator....."
dfx identity use userA
echo "List of Wills By User A ===> " $userA
dfx canister call will get_wills_for_testator '()'

echo -e "\n List all Wills Created For Heir..."
dfx identity use userB
echo "List of Wills FOr UserB ====> " $userB
dfx canister call will get_wills_for_heir '()'

echo -e "\n Deleting a Will By Testator........"
dfx identity use userA
dfx canister call will icrc_delete_will '(163_824_807:nat32)'

# Get All Wills Created By Testator
echo -e "\nList of All Wills Created By Testator....."
dfx identity use userA
echo "List of Wills By User A ===> " $userA
dfx canister call will get_wills_for_testator '()'

echo -e "\n List all Wills Created For Heir..."
dfx identity use userB
echo "List of Wills FOr UserB ====> " $userB
dfx canister call will get_wills_for_heir '()'

echo -e "\n==========================================SWITCHING TO DEFAULT IDENTITY========================================="
dfx identity use default
