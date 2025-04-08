#!/bin/bash

BASE_URL="https://www.ncei.noaa.gov/cdo-web/api/v2"
NOAA_API_KEYS=("${NOAA_API_KEY_1}" "${NOAA_API_KEY_2}" "${NOAA_API_KEY_3}")
START_OFFSET=1000
LIMIT=1000
TOTAL_COUNT=4900767
NUM_KEYS=${#NOAA_API_KEYS[@]}
OUTPUT_DIR="$HOME/noaa_data"
LATEST_DATE="2023-03-31"
END_DATE=$(date -d "$LATEST_DATE -1 day" +"%Y-%m-%d")
# END_DATE="2024-03-31"
START_DATE=$(date -d "$END_DATE -1 year" +"%Y-%m-%d")
DATASET_ID=("GSOM")
export NOAA_API_KEYS_STR="${NOAA_API_KEYS[*]}"

export BASE_URL OUTPUT_DIR LIMIT START_OFFSET START_DATE END_DATE NUM_KEYS  NOAA_API_KEYS_STR LIMIT
fetch_page() {
    local offset="$1"
    local dataset_id="$2"
    IFS=' ' read -r -a NOAA_API_KEYS <<< "$NOAA_API_KEYS_STR"
    local max_retries=5
    local retry_delay=2
    local attempt=1 
    mkdir -p "${OUTPUT_DIR}/${dataset_id}/${START_DATE}_${END_DATE}"
    local FILE_NAME="${OUTPUT_DIR}/${dataset_id}/${START_DATE}_${END_DATE}/${offset}"
     # Calculate the initial API key index based on the offset.
    local initial_index=$(( (offset / LIMIT) % NUM_KEYS ))
    while [ "$attempt" -le "$max_retries" ]; do

        local key_index=$(( (initial_index+attempt-1) % ${#NOAA_API_KEYS[@]} ))
        local current_api_key="${NOAA_API_KEYS[$key_index]}"
    
        echo "🆔 Running PID $$ for offset=$offset on endpoint=$endpoint (Attempt $attempt) $current_api_key"
        
        URL="$BASE_URL/data?datasetid=$dataset_id&offset=$offset&limit=$LIMIT&startdate=$START_DATE&enddate=$END_DATE"
        echo "Requesting: $URL"
        RESPONSE=$(curl -s -X GET "$URL" -H "Token: $current_api_key")
  
        # ✅ Check if response is valid JSON
        if ! echo "$RESPONSE" | jq empty 2>/dev/null; then
            echo "🚨 ERROR: Invalid JSON received (Attempt $attempt). Retrying in $retry_delay seconds..."
            echo "$RESPONSE" > "$FILE_NAME.txt"
            sleep "$retry_delay"
            ((attempt++))
            continue
        fi

        # ✅ Check if "results" exists and is not empty
        if ! echo "$RESPONSE" | jq 'has("results") and (.results | length > 0)' 2>/dev/null | grep -q true; then
            echo "🚨 ERROR: 'results' is missing or empty (Attempt $attempt). Retrying in $retry_delay seconds..."
            echo "$RESPONSE" > "$FILE_NAME.txt"
            sleep "$retry_delay"
            ((attempt++))
            continue
        fi

        # ✅ If everything is fine, save the response
        echo "$RESPONSE" | jq . > "$FILE_NAME.json"
        echo "✅ Saved: $FILE_NAME.json"
        return 0

 
    done

}
# Check if the required environment variables are set

export -f fetch_page
OFFSETS=$(seq "$START_OFFSET" "$LIMIT" "$TOTAL_COUNT")


parallel --jobs 5 --progress --bar --joblog fetch_log.txt \
    fetch_page ::: "${OFFSETS[@]}" ::: "${DATASET_ID[@]}"