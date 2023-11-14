#!/bin/bash -c

export MATCHID_URL="https://deces.matchid.io/deces/api/v1/version;"
export AWS_URL="https://wfqec4ytsif4icqmpb6w4wpray0afpxr.lambda-url.us-east-2.on.aws/?id=kutIDRN21IH_"

# for i in {1..100}; do

#     echo "$i"
#     curl -s -o response.txt -w "%{http_code}" https://wfqec4ytsif4icqmpb6w4wpray0afpxr.lambda-url.us-east-2.on.aws/?id=kutIDRN21IH_
#     echo -n " "
#     sha256sum response.txt | awk '{print $1}'

# done

for i in {1..28}; do

    echo "Request $i sent." &

    curl -s -o http_responses/response"$i".txt -w "%{http_code}" "$AWS_URL" &

done

wait

for i in {1..28}; do

    printf "\n"

    echo "Request $i completed."
    sha256sum http_responses/response"$i".txt | awk '{print $1}'
done
