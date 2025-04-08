"use client";
import React, { useEffect, useState } from "react";
import DeckGL, { LayersList } from "deck.gl";
import { Map } from "react-map-gl/maplibre";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { DataFilterExtension, DataFilterExtensionProps } from '@deck.gl/extensions';
import { FeatureCollection, Point } from "geojson"; // ✅ Import GeoJSON types
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../app/page.module.css";
import ReactSlider from "react-slider";
import "bootstrap/dist/css/bootstrap.min.css";
import { scaleLinear } from 'd3';
import ColorBar from "./ColorBar";
import DateRangePicker from "./DateRangePicker";
import Dropdown from "./Dropdown";


// Number of time steps available (e.g., 5 temperature records over time)

// Initial view state
const INITIAL_VIEW_STATE = {
    latitude: 51.47,
    longitude: 0.45,
    zoom: 2,
    bearing: 0,
    pitch: 0,
};

const layout = {

    sliders: [
        {
            active: 0,

        },
    ],
}
// Define a color scale for temperature values
// Create a linear color scale from blue to red
const colorScale = scaleLinear()
  .domain([-300,300])
  .range(["blue", "red"]);

const getTempColor = (temp: number) => {

     var color = colorScale(temp);
      var colorArray = color.match(/\d+/g);
      return [parseInt(colorArray[0]), parseInt(colorArray[1]), parseInt(colorArray[2])];

}
const  generateDateRange=(startDate, endDate) =>{
  const dates = [];
  const currentDate = new Date(startDate);

  // Loop until currentDate is greater than endDate
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]); // add a copy of currentDate
    currentDate.setDate(currentDate.getDate() + 1); // increment by one day
  }

  return dates;
}
export default function DeckMap() {

    const [pointData, setPointData] = useState<any>([]);
    const [layers, setLayers] = useState<LayersList>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [timestamps, setTimestamps] = useState<string[]>([]); // List of timestamps
    const [selectedTimestampIndex, setSelectedTimestampIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [minDate, setMinDate] = useState<Date | null>(null);
    const [maxDate, setMaxDate] = useState<Date | null>(null);
    const [datatypes, setDatatypes] = useState<string[]>([]);
    const [datasetNames, setDatasetNames] = useState<string[]>([]);
    const [selectedDatatype, setSelectedDatatype] = useState<string>("");
    const [selectedDataset, setSelectedDataset] = useState<string>("");


   const fetchTimestamps = async () => {
                  const response = await fetch("http://localhost:8080/data-range");
                  const data = await response.json();
                  setMinDate(new Date(data.minDate));
                  setMaxDate(new Date(data.maxDate));
};
    const fetchDataType = async () => {
                      const response = await fetch("http://localhost:8080/data-set");
                      const data = await response.json();
                     setDatatypes(data.dataTypes);
                       setDatasetNames(data.datasetNames);
                    };

    useEffect(() => {

        if (pointData.length === 0 ) {
            return;
        }
        console.log(pointData.length)
        const selectedTimestamp = timestamps[selectedTimestampIndex];
        console.log("Selected timestamp:", selectedTimestamp);
        console.log(timestamps)
        setLayers([
            new ScatterplotLayer({
                id: `scatterplot-layer-${selectedTimestamp}`,
                data: pointData.filter(d => d.properties.data[selectedTimestamp]!==undefined),
                getPosition: (d) => d.geometry.coordinates as [number, number],
                getRadius: 50000, // Circle size in meters
                getFillColor: (d) => getTempColor(d.properties.data[selectedTimestamp]),
                pickable: true,
                opacity: 0.8,
            }),
        ]);

    }, [pointData]);


    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTimeStep = parseInt(event.target.value);
        setSelectedTimestampIndex(newTimeStep);

    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isPlaying && timestamps.length > 0) {
            interval = setInterval(() => {
                setSelectedTimestampIndex((prevIndex) =>
                    prevIndex === timestamps.length - 1 ? 0 : prevIndex + 1
                );
            }, 1000); // Change the time interval as needed (e.g., 1000ms = 1 second)
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, timestamps]);
    useEffect(() => {
        fetchTimestamps();
        fetchDataType();

        },[]);

useEffect(() => {
    async function fetchPoints(startDate: String, endDate: String, datatype: String, datasetName: String) {

                    setPointData([]);
                    try {
                        console.log("Fetching point data...");
                        const response = await fetch(`http://localhost:8080/data?startDate=${startDate}&endDate=${endDate}&datatype=${datatype}&datasetName=${datasetName}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",

                            }
                        });
                        const data = await response.json();
                        console.log("Data:", data[0]);
                        setPointData((prevData) => [...prevData, ...data]);

                    } catch (error) {
                        console.error("Error fetching point data:", error);
                    }
                }
    if(selectedDatatype && selectedDataset && startDate && endDate) {
        const dateList = generateDateRange(startDate, endDate);
        setTimestamps(dateList);
        setSelectedTimestampIndex(0);
       fetchPoints(startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0], selectedDatatype, selectedDataset);
    }},[selectedDatatype, selectedDataset,startDate, endDate]);



return (
  <div className="container-fluid overflow-hidden">

    <DeckGL controller={true} initialViewState={INITIAL_VIEW_STATE} layers={layers}>
      <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
    </DeckGL>

    <div className={styles.sliderContainer}>

      <ColorBar min={-300} max={300} gradient="linear-gradient(to right, blue, red)" />

      <DateRangePicker
        className="mx-3"
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        minDate={minDate}
        maxDate={maxDate}
      />

      {datasetNames.length > 0 && datatypes.length > 0 && (
        <Dropdown datasets={datasetNames} datatypes={datatypes}
        setSelectedDataset={setSelectedDataset}
        setSelectedDatatype={setSelectedDatatype}
        />
      )}

  {timestamps.length > 0 && selectedTimestampIndex !== null && (
     <>
    <h5>{timestamps[selectedTimestampIndex]}</h5>
    <button className="btn btn-primary">Animate</button>
  </>
    )}
</div>
  </div>
);
