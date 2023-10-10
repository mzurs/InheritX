#!/bin/bash

echo $1 "Blocks Mined for" $2

.bitcoin/bin/bitcoin-cli -conf=$(pwd)/.bitcoin.conf generatetoaddress $1 $2

# //other
# n2dcQfuwFw7M2UYzLfM6P7DwewsQaygb8S


# other address
# ms2qxPw1Q2nTkm4eMHqe6mM7JAFqAwDhpB
