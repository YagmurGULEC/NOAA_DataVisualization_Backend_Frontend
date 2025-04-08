#!/bin/bash

START_OFFSET=1000
LIMIT=1000

DATASET_ID=("GSOM")
OUTPUT_DIR="."
COMPRESSED_DIR="./compressed"
export START_OFFSET LIMIT COMPRESSED_DIR
mkdir -p "$COMPRESSED_DIR"
check_data() {
    local folder="$1"
    local first="${folder}/0.json"
    local missing_files=()  # local array for missing files in this folder
    base=$(basename "$folder")                  # yields "2024-04-01_2025-04-01"
    parent=$(basename "$(dirname "$folder")")   # yields "GSOM"
    zip_name="${parent}_${base}.zip"
    echo "Zipping folder: $folder with name: $zip_name"
    # Check if the first JSON file is valid
    if jq 'has("results") and (.results | length > 0)' "$first" 2>/dev/null | grep -q true; then
        local count
        count=$(jq '.metadata.resultset.count' "$first")
        local offsets
        offsets=$(seq "$START_OFFSET" "$LIMIT" "$count")
        
        for i in $offsets; do
            local file="${folder}/${i}.json"
            if [ ! -f "$file" ]; then
                missing_files+=("$file")
            elif ! jq 'has("results") and (.results | length > 0)' "$file" 2>/dev/null | grep -q true; then
                missing_files+=("$file")
            fi
        done
    else
        missing_files+=("$first")
    fi
     # If no files are missing, zip the folder. Otherwise, list all missing files.
    if [ ${#missing_files[@]} -eq 0 ]; then
        echo "All files in $folder are valid. Zipping folder... "
        zip -j "$COMPRESSED_DIR/$zip_name" "$folder"/*.json
       
       
    else
        echo "🚨 ERROR: The following files in $folder are missing or invalid:"
        for file in "${missing_files[@]}"; do
            echo "  $file"
        done
    fi
    
}

dates=$(find "${OUTPUT_DIR}/GSOM" -mindepth 1 -type d )
for folder in $dates; do
    echo "Checking folder: $folder"
    check_data "$folder"
done

