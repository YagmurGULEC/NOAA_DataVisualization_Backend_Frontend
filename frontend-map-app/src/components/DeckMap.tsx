"use client";
import React, { useEffect, useState } from "react";
import DeckGL, { LayersList } from "deck.gl";
import { Map } from "react-map-gl/maplibre";
import { ScatterplotLayer } from "@deck.gl/layers";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../app/page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { ScaleLinear, scaleLinear } from "d3-scale";


import ColorBar from "./ColorBar";
import DateRangePicker from "./DateRangePicker";
import Dropdown from "./Dropdown";

type GeoJsonFeature = {
    type: "Feature";
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
    properties: {
        data: {
            [date: string]: number;
        };
        name: string;

    };
};

type MinMax = {
    min: number;
    max: number;
};

const INITIAL_VIEW_STATE = {
    latitude: 51.47,
    longitude: 0.45,
    zoom: 2,
    bearing: 0,
    pitch: 0,
};



export default function DeckMap() {

    const [pointData, setPointData] = useState<GeoJsonFeature[]>([]);
    const [layers, setLayers] = useState<LayersList>([]);
    const [selectedDatatype, setSelectedDatatype] = useState<string>("");
    const [selectedDataset, setSelectedDataset] = useState<string>("");
    const [dates, setDates] = useState<string[]>([]); // List of dates
    const [maxMinValue, setMaxMinValue] = useState<MinMax | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [colorScale, setColorScale] = useState<ScaleLinear<string, string> | null>(null);
    const [hoverInfo, setHoverInfo] = useState<GeoJsonFeature | null>(null);
    useEffect(() => {

        if (pointData.length === 0 || !maxMinValue) {
            setLayers([]);
            return;
        }
        setColorScale(() => {
            return scaleLinear<string, string>()
                .domain([maxMinValue.min, maxMinValue.max])
                .range(["blue", "red"])

        });


    }, [pointData, maxMinValue]);

    useEffect(() => {
        if (colorScale === null) {
            return;
        }
        const getTempColor = (temp: number): [number, number, number] => {
            const color = colorScale(temp);
            const colorArray = color.match(/\d+/g);
            return colorArray ? [parseInt(colorArray[0]), parseInt(colorArray[1]), parseInt(colorArray[2])] as [number, number, number] : [0, 0, 0];
        }
        setLayers([
            new ScatterplotLayer({
                id: `scatterplot-layer`,
                data: selectedDate ? pointData.filter(d => d.properties.data[selectedDate] !== undefined) : [],
                getPosition: (d) => d.geometry.coordinates as [number, number],
                getRadius: 50000, // Circle size in meters
                getFillColor: (d) => selectedDate ? getTempColor(d.properties.data[selectedDate]) : [0, 0, 0],
                pickable: true,
                opacity: 0.8,
                onHover: info => {
                    if (info.object) {
                        setHoverInfo(info.object);
                    } else {
                        setHoverInfo(null);
                    }
                }
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
                const maxValue = Math.max(...(data as GeoJsonFeature[]).map((d) => d.properties.data[selectedDate]));
                const minValue = Math.min(...(data as GeoJsonFeature[]).map((d) => d.properties.data[selectedDate]));

                setMaxMinValue({ max: maxValue, min: minValue });

            }
            catch (error) {
                console.error("Error fetching point data:", error);
            }
        }
        fetchPointData(selectedDatatype, selectedDataset, selectedDate);

    }, [selectedDate]);

    return (
        <div className="deckgl">

            <DeckGL controller={true} initialViewState={INITIAL_VIEW_STATE} layers={layers}
                getCursor={({ isDragging, isHovering }) => {
                    // console.log(isDragging, isHovering);
                    if (isDragging) return 'grabbing';
                    if (isHovering) return 'pointer';
                    return 'grab';
                }}>
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
                {hoverInfo && (

                    <div
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            pointerEvents: 'none',
                            left: 10,
                            top: 10,
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                        }}
                    >
                        <div><b>Coordinates:</b> {hoverInfo.geometry.coordinates.join(", ")}</div>
                        <div><b>Station Name:</b> {hoverInfo.properties.name}</div>
                        <div><b>Value:</b> {selectedDate && hoverInfo.properties.data[selectedDate]}</div>
                    </div>
                )}

            </div>
        </div>
    );
}
