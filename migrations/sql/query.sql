

-- SELECT DISTINCT geo.station_data.datatype FROM geo.station_data


-- select count(*)
--   from geo.station_data;

-- select count(distinct station_id)
--   from geo.station_data;

select count(*)
  from geo.stations;

select * from geo.stations limit 10;

select count(*)
  from geo.station_data;
select * from geo.station_data limit 10;
-- ---Query to filter by date and datatype 

-- select *
--   from geo.stations
--   join geo.station_data
-- on geo.stations.id = geo.station_data.station_id
--  where geo.station_data.date between '2025-01-01' and '2025-03-21'
--    and geo.station_data.dataset_name = 'GSOM'
--    and geo.station_data.datatype = 'TMAX' LIMIT 10;
-- EXPLAIN ANALYZE
-- SELECT 
--     dataset_name,
--     datatype,
--     ARRAY_AGG(DISTINCT date ORDER BY date) AS available_dates
-- FROM geo.station_data
-- GROUP BY dataset_name, datatype
-- ORDER BY dataset_name, datatype;


-- Query to see  dataset_name and datatype by date
-- explain analyze
-- select geo.stations.id, geo.stations.name,geo.station_data.dataset_name,
--        geo.station_data.datatype,geo.station_data.date
--   from geo.station_data
--   join geo.stations
--  on geo.stations.id = geo.station_data.station_id
--   where geo.station_data.date between '2025-01-01' and '2025-03-01'
--  limit 10;


-- select distinct geo.station_data.datatype,
--                 geo.station_data.dataset_name
--   from geo.station_data;

-- select distinct geo.station_data.date
--   from geo.station_data
--  where date between '2025-01-01' and '2025-03-01';


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
--    and geo.station_data.dataset_name = 'GSOM' LIMIT 10;

-- select datatype,
--        min(value) as min_value,
--        max(value) as max_value
--   from geo.station_data
--  where dataset_name = 'GSOM'
--  group by datatype;