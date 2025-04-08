import React, { useState,useEffect} from "react";


type Props = {
  datasets: string[];
  datatypes: string[];
    setSelectedDataset: (dataset: string) => void;
    setSelectedDatatype: (datatype: string) => void;
};
const dict_datasets = {
                          "GHCND": "Daily Summaries",
                          "GSOM": "Global Summary of the Month",
                          "GSOY": "Global Summary of the Year",
                          "NEXRAD2": "Weather Radar (Level II)",
                          "NEXRAD3": "Weather Radar (Level III)",
                          "NORMAL_ANN": "Normals Annual/Seasonal",
                          "NORMAL_DLY": "Normals Daily",
                          "NORMAL_HLY": "Normals Hourly",
                          "NORMAL_MLY": "Normals Monthly",
                          "PRECIP_15": "Precipitation 15 Minute",
                          "PRECIP_HLY": "Precipitation Hourly"
                      };

const dict_datatypes = {
                          "PRCP": "Precipitation",
                          "SNOW": "Snowfall",
                          "SNWD": "Snow Depth",
                          "TMAX": "Max Temperature",
                          "TMIN": "Min Temperature",
                          "TAVG": "Average Temperature"
                      };
const Dropdown:React.FC<Props> =
({datasets,datatypes,setSelectedDataset,setSelectedDatatype })=>{
    const handleSelectedDatatypes = (event: React.ChangeEvent<HTMLSelectElement>) => {

        setSelectedDatatype(event.target.value);
    }
    const handleSelectedDatasets = (event: React.ChangeEvent<HTMLSelectElement>) => {

        setSelectedDataset(event.target.value);
    }
    return (
        <div className="d-flex flex-column align-items-start gap-2">
        <label className="text-bold text-dark">Datatypes</label>
        <select onChange={handleSelectedDatatypes}>
        <option >Select</option>
            {datatypes.map((datatype,i) => (
                <option key={i} value={datatype}>{dict_datatypes[datatype]} ({datatype})</option>
            ))}

        </select>
         <label className="text-bold text-dark">Datasets</label>
                <select onChange={handleSelectedDatasets}>
                 <option >Select</option>
                    {datasets.map((datatype,i) => (
                        <option key={i} value={datatype}>{dict_datasets[datatype]} ({datatype})</option>
                    ))}

                </select>

        </div>

        )


    }
export default Dropdown;