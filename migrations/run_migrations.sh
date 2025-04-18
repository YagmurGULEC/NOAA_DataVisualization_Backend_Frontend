#!/bin/bash

set -e  # Stop the script on any error

DB_NAME="noaa_database"
CONTAINER_NAME="postgres-postgis"
CONTAINER_ID=$(docker ps -a --filter "name=${CONTAINER_NAME}" --format "{{.ID}}")
POSTGRES_USER="noaa_user"
DESTINATION="/var/lib/postgresql/data"
SQL_FILES="./sql"
# Function to check if the database exists
check_db_exists() {
    DB_EXIST=$(docker exec -i "$CONTAINER_ID" psql -U "$POSTGRES_USER" -d postgres -tA -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';")
    if [ -z "$DB_EXIST" ]; then
        echo "❌ Database does not exist."
        exit 1
    else
        echo "✅ Database '$DB_NAME' already exists."
    fi
}

# Function to check if the table exists
check_table_exists() {
    TABLE_EXIST=$(docker exec -i "$CONTAINER_ID" psql -U "$POSTGRES_USER" -d "$DB_NAME" -tA -c "SELECT 1 FROM information_schema.tables WHERE table_schema='geo' AND table_name='stations';")
    if [ -z "$TABLE_EXIST" ]; then
        echo "❌ Table does not exist."
        exit 1
    else
        echo "✅ Table 'geo.stations' already exists."
    fi
}

copy_csv_to_container() {
    files=$(ls ./data/csv/*.csv)
    # shellcheck disable=SC2034
    for file in $files; do
      echo "🚀 Copying CSV file: $file"
        docker cp "$file" "$CONTAINER_NAME":"$DESTINATION"
    done

    echo "✅ CSV file copied: $CSV_FILE"
}



delete_csv_from_container() {
    files=$(ls /csv/*.csv)
    # shellcheck disable=SC2034
    for file in $files; do
      echo "🚀 Deleting CSV file: $file"
        docker exec -i "$CONTAINER_ID" rm "$DESTINATION"/$(basename "$file")
    done

    echo "✅ CSV file deleted: $CSV_FILE"
}

# Function to apply a migration SQL file
apply_migration() {
    MIGRATION_FILE="$1"

    if [ ! -f "${SQL_FILES}/$MIGRATION_FILE" ]; then
        echo "❌ Migration file '$MIGRATION_FILE' not found."
        exit 1
    fi

    echo "🚀 Applying migration: $MIGRATION_FILE"
    cat "${SQL_FILES}/${MIGRATION_FILE}"| docker exec -i "$CONTAINER_ID" psql -U "$POSTGRES_USER" -d "$DB_NAME"
    echo "✅ Migration applied: $MIGRATION_FILE"
}

if [ "$#" -eq 0 ]; then
    echo "❌ No migration specified. Use 'all' to apply all migrations or specify a file."
    exit 1
fi

check_db_exists
check_table_exists
if [ "$1" == "copy_all" ]; then

    csv_files=$(find ./csv -type f -name "*.csv")
    for file in $csv_files; do
        dirname=$(basename $(dirname "$file"))
        filename=$(basename "$file")
        echo "🚀 Copying CSV file: $file to $CONTAINER_ID"
        docker cp "$file" "$CONTAINER_ID":"$DESTINATION"
    done

elif [ "$1" == "delete" ]; then
    delete_csv_from_container

elif [ "$1" == "insert_station" ]; then
    echo " Running $1"
    docker exec -i "$CONTAINER_ID" psql -U "$POSTGRES_USER" -d "$DB_NAME" -c "\copy geo.stations FROM '$DESTINATION/stations.csv' DELIMITER ',' CSV HEADER;"
elif [ "$1" == "insert_station_data" ]; then
        echo "Running $1"
    
        csv_files=$(find ./csv/station_data -type f -name "*.csv")
        for f in $csv_files; do
            filename=$(basename "$f")
            docker exec -i "$CONTAINER_ID" psql -U "$POSTGRES_USER" -d "$DB_NAME" -c "\copy geo.station_data FROM '$DESTINATION/$filename' DELIMITER ',' CSV HEADER;"
        done
elif [ "$1" == "delete_all_csv" ]; then
    echo "Running $1"
    csv_files=$(find ./csv -type f -name "*.csv")
    for file in $csv_files; do
        filename=$(basename "$file")
        echo "🚀 Deleting CSV file: $file from $CONTAINER_ID"
        docker exec -i "$CONTAINER_ID" rm "$DESTINATION/$filename"
    done
else 
 
    apply_migration "$1"


fi
