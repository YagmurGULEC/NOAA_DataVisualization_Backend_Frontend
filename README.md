# National Centers For Environmental Information Data Pipeline - End-to-End Project
A full-stack  data pipeline that includes:
- Data Ingestion from Climate data online web service (https://www.ncdc.noaa.gov/cdo-web/webservices/v2#gettingStarted)
- Data preprocessing 
- Database Layer
- Backend Service
- Frontend Interface

Frontend, backend and database run on Docker. So no need to install 

```text
.
├── backend (RestFul backend service in GeoJSON format)
├── data_preprocess (Data processing tools to convert json files to CSV to insert into database)
├── fetch_data (Bash scripts to make requests)
├── frontend-map-app (Frontend for map visualization)
└── migrations (Database migration data and sql and bash scripts)

```

## Data Ingestion
I fetched the data from the base URL https://www.ncei.noaa.gov/cdo-web/api/v2/{endpoint} by using a custom Bash script to download NOAA climate data using multiple API keys in parallel for better speed and rate limit handling.
### 🛠️ Script Overview
1. Fetches climate data (e.g., GSOM) from NOAA’s API
2. Uses multiple API keys in a round-robin fashion to bypass rate limits
3. Splits large requests into paginated segments using offset
4. Runs requests in parallel using GNU parallel
5. Validates and saves only valid JSON responses

```text
fetch_data
├── check_data.sh (Check for the missing offsets)
└── fetch_round_robin.sh (Script to make requests by using many TOKENs alternately)

```
### 📂 Output Structure
```text
└── GSOM/
    └── 2022-04-01_2023-03-31/
        ├── 0.json
        ├── 1000.json
        ├── 2000.json
        └── ...

```

Data is retrieved in batch requests over a one-year time window. Once downloaded, the data is transformed by processing into CV before being inserted into the database. 


## Data Processing 
I wrote a custom Python on Google COLAB (https://colab.research.google.com/drive/1fCd7rRD1-ebMzBYxOT8pdtgKqN29SeP8?usp=drive_link). Preprocessing steps are as follows:

1. Asynchronous JSON Reading
2. Write JSONL (all valid records are written into one .jsonl file)
3. Converting JSONL to DataFrame and remove duplicates. 
4. Data saved in CSV in the same order as the schema 

Data and the notebook can be found in the shared folder (https://drive.google.com/drive/folders/1Cy7npgD27nL5gDY7abR0EjOsXw8w9OGN?usp=sharing)

## Database Design

The processed NOAA data is stored in a PostgreSQL database with PostGIS extension enabled for geospatial operations. The database 

![Alt text](database.drawio.svg)

### 📌 Key Fields and Constraints
- Primary Keys:

stations.id is a unique station identifier

station_data uses a composite key on (date, station_id, dataset_name, datatype)
### 🔑 Primary Keys

- **`stations.id`**: Unique station identifier
- **`station_data (date, station_id, dataset_name, datatype)`**: Composite primary key ensuring one value per day per datatype per station

### 🔗 Foreign Key

- **`station_data.station_id` → `stations.id`**
  - Enforced with `ON DELETE CASCADE` to remove station data if the station is deleted

### 🧭 Indexes

- **GIST index** on `stations.geom`  
  For fast spatial queries using PostGIS (e.g., find stations within a radius)
- **B-tree index** on `station_data (date, datatype, dataset_name)`  
  Optimizes filtering by time, variable type, and dataset

``` text
migrations
├── data
│   └── csv
├── run_migrations.sh
└── sql
    ├── init.sql
    ├── insert_stations.sql
    ├── insert_stations_data.sql
    └── query.sql
  ```



