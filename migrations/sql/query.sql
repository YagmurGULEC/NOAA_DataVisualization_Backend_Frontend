-- SELECT DISTINCT geo.station_data.datatype FROM geo.station_data


-- select count(*)
--   from geo.station_data;

-- select count(distinct station_id)
--   from geo.station_data;

-- select count(*)
--   from geo.stations;

-- ---Query to filter by date and datatype 

-- select geo.stations.id,
--        geo.stations.name,
--        geo.station_data.date,
--        geo.station_data.dataset_name,
--        geo.station_data.datatype,
--        geo.station_data.value
--   from geo.stations
--   join geo.station_data
-- on geo.stations.id = geo.station_data.station_id
--  where geo.station_data.date between '2025-01-01' and '2025-03-01'
--    and geo.station_data.dataset_name = 'GSOM'
--    and geo.station_data.datatype = 'TMAX' LIMIT 10;

-- Query to see  dataset_name and datatype by date
explain analyze
select geo.stations.id, geo.stations.name,geo.station_data.dataset_name,
       geo.station_data.datatype,geo.station_data.date
  from geo.station_data
  join geo.stations
 on geo.stations.id = geo.station_data.station_id
  where geo.station_data.date between '2025-01-01' and '2025-03-01'
 limit 10;

