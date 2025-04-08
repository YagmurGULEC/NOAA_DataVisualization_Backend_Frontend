COPY geo.station_data (date,datatype,station_id,value,dataset_name)
FROM '/var/lib/postgresql/data/GSOM_2022-03-30_2023-03-30.csv'
DELIMITER ','
CSV HEADER;