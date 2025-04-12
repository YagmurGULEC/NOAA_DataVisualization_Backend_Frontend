"use client";
import React, { use, useEffect, useState } from "react";
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
import { parseISO, format, setDate, min } from 'date-fns';
import { se } from "date-fns/locale";


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



export default function DeckMap() {

    const [pointData, setPointData] = useState<any>([]);
    const [layers, setLayers] = useState<LayersList>([]);

    const [timestamps, setTimestamps] = useState<string[]>([]); // List of timestamps

    const [isPlaying, setIsPlaying] = useState(false);

    const [selectedDatatype, setSelectedDatatype] = useState<string>("");
    const [selectedDataset, setSelectedDataset] = useState<string>("");
    const [dates, setDates] = useState<string[]>([]); // List of dates
    const [maxMinValue, setMaxMinValue] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [colorScale, setColorScale] = useState<any>(null);

    useEffect(() => {

        if (pointData.length === 0 || !maxMinValue) {
            setLayers([]);
            return;
        }
        setColorScale(() => {
            return scaleLinear()
                .domain([maxMinValue.min, maxMinValue.max])
                .range(["blue", "red"]);
        });


    }, [pointData, maxMinValue]);

    useEffect(() => {
        if (colorScale === null) {
            return;
        }
        const getTempColor = (temp: number) => {
            var color = colorScale(temp);
            var colorArray = color.match(/\d+/g);
            return [parseInt(colorArray[0]), parseInt(colorArray[1]), parseInt(colorArray[2])];

        }
        setLayers([
            new ScatterplotLayer({
                id: `scatterplot-layer`,
                data: pointData.filter(d => d.properties.data[selectedDate] !== undefined),
                getPosition: (d) => d.geometry.coordinates as [number, number],
                getRadius: 50000, // Circle size in meters
                getFillColor: (d) => getTempColor(d.properties.data[selectedDate]),
                pickable: true,
                opacity: 0.8,
            }),
        ]);

    }, [colorScale])

    useEffect(() => {


        const fetchDates = async (datatype: string, datasetName: string) => {
            try {
                const response = await fetch(`http://localhost:8080/dates?datatype=${datatype}&datasetName=${datasetName}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",

                    }

                });
                const data = await response.json();
                if (data && data.length > 0) {
                    setDates([...data.map((date: string) => date.split("T")[0])]);
                }
            }
            catch (error) {
                console.error("Error fetching point data:", error);
            }
        }

        if (selectedDatatype && selectedDataset) {

            fetchDates(selectedDatatype, selectedDataset);

        }
    }, [selectedDatatype, selectedDataset]);

    useEffect(() => {
        if (!selectedDate) {
            return;
        }

        console.log("Selected date:", selectedDate);
        const fetchPointData = async (datatype: string, datasetName: string, date: string) => {
            try {
                const response = await fetch(`http://localhost:8080/data/exact?datatype=${datatype}&datasetName=${datasetName}&date=${date}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",

                    }

                });
                const data = await response.json();

                setPointData(data);
                const maxValue = Math.max(...data.map((d: any) => d.properties.data[selectedDate]));
                const minValue = Math.min(...data.map((d: any) => d.properties.data[selectedDate]));
                setMaxMinValue({ max: maxValue, min: minValue });
                console.log("Max value:", maxValue);
            }
            catch (error) {
                console.error("Error fetching point data:", error);
            }
        }
        fetchPointData(selectedDatatype, selectedDataset, selectedDate);

    }, [selectedDate]);

    return (
        <div className="container-fluid overflow-hidden">

            <DeckGL controller={true} initialViewState={INITIAL_VIEW_STATE} layers={layers}>
                <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
            </DeckGL>

            <div className={styles.sliderContainer}>
                {(maxMinValue) && (
                    <ColorBar min={maxMinValue.min} max={maxMinValue.max} gradient="linear-gradient(to right, blue, red)" />)
                }

                <Dropdown
                    selectedDataset={selectedDataset}
                    selectedDatatype={selectedDatatype}
                    setSelectedDataset={setSelectedDataset}
                    setSelectedDatatype={setSelectedDatatype}
                />
                {(dates.length > 0) && (
                    <DateRangePicker

                        filterDates={dates} setSelectedDate={setSelectedDate}
                    />
                )}

            </div>
        </div>
    );
}
