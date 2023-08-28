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

echo -e "\n Registering User A...................................."

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

echo -e "\n Registering User B...................................."

echo -e "\n Creating a user with Details of User B =====> " $UserB
# Adding User Details
dfx identity use userB
dfx canister call will add_user_details '(record 
{ firstNames= vec{"lartrtrun";"aeewewule"};
  lastName= "rrgr";
  sex= "M";
  birthDate= "19350528";
  birthLocationCode= "78038";
})'

# Get UserB Details
dfx identity use userB
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
dfx canister call will create_will "( variant{ icrc=record { willName= \"Transfer_to_UserB\" ;
  identifier= $Identifier; heirs= principal \"$userB\" ;  tokenTicker = \"ICP\"; amount = 100; }}, \"ICRC\")"

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
dfx canister call will delete_will '(90_093_131:nat32, "ICRC" )'

# Get All Wills Created By Testator
echo -e "\nList of All Wills Created By Testator....."
dfx identity use userA
echo "List of Wills By User A ===> " $userA
dfx canister call will get_wills_for_testator '()'

echo -e "\n List all Wills Created For Heir..."
dfx identity use userB
echo "List of Wills FOr UserB ====> " $userB
dfx canister call will get_wills_for_heir '()'

# ICRC Will With Duplicate Identifier
echo -e "\n Creating an ICRC will with duplicate Identifier"
dfx identity use userA
dfx canister call will create_will "( variant{ icrc= record { willName= \"Transfer_to_UserB\" ;
  identifier= 178_383_194; heirs= principal \"$userB\" ;  tokenTicker = \"ICP\"; amount = 100;} },\"ICRC\")"

# Delete a will from unauthorized user
echo -e "\n Deleting  UserA Will From UserB Principal"
dfx identity use userB
dfx canister call will delete_will '(90_093_131:nat32, "ICRC" )'

echo -e "\n.................Reuesting Random Will Identifier....................."
dfx identity use userA
Identifier=$(dfx canister call will request_random_will_identifier)
echo "Random Identifier = " $Identifier
# Creating a will with wrong supported Asset Type
echo -e "\n Creating a new will with wrong supported Assets Type"
dfx identity use userA
dfx canister call will create_will "( variant{ icrc=record { willName= \"Transfer_to_UserB\" ;
  identifier= $Identifier ; heirs= principal \"$userB\" ;  tokenTicker = \"IICP\"; amount = 101; }} , \"ICRC\")"

# Creating and Claiming a will for an Identifier

echo -e "\n Creating a new will with wrong supported Assets Type"
dfx identity use userA
dfx canister call will create_will "( variant{ icrc=record { willName= \"Transfer_to_UserB\" ;
  identifier= $Identifier ; heirs= principal \"$userB\" ;  tokenTicker = \"ICP\"; amount = 101; }} , \"ICRC\")"


# Swithcing to default in the end of script
echo -e "\n==========================================SWITCHING TO DEFAULT IDENTITY========================================="
dfx identity use default
