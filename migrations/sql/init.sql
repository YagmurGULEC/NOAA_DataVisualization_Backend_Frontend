
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE SCHEMA IF NOT EXISTS geo;
CREATE TABLE IF NOT EXISTS geo.stations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    geom GEOMETRY(Point, 4326)
);

CREATE TABLE IF NOT EXISTS geo.station_data (
    date DATE NOT NULL,
    station_id TEXT NOT NULL,
    dataset_name TEXT NOT NULL,
    datatype TEXT NOT NULL,
    value FLOAT NOT NULL,
    PRIMARY KEY (date, station_id, dataset_name, datatype),
    FOREIGN KEY (station_id) REFERENCES geo.stations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS stations_geom_idx
ON geo.stations
USING GIST (geom);

CREATE INDEX IF NOT EXISTS station_data_filter_idx
ON geo.station_data (date, datatype, dataset_name);


