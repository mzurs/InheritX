#!/bin/bash

dfx canister call providers check_user_dead_details \
'( record { firstName ="Elijah";lastName="Julien";birthDate="23%2F12%2F1927"; 
birthLocationCode=75113;deathDate="16%2F02%2F2023";deathLocationCode=10298; })'
# https://deces.matchid.io/deces/api/v1/search?firstName=Elijah&legalName=JULIAN%20Elie&sex=M&birthDate=23%2F12%2F1927&deathDate=16%2F02%2F2023&lastName=Julien&birthLocationCode=75113&deathLocationCode=10298