import { set } from "date-fns";
import { da } from "date-fns/locale";
import React, { useState, useEffect, use } from "react";


type Props = {
    selectedDataset: string;
    selectedDatatype: string;
    setSelectedDataset: (dataset: string) => void;
    setSelectedDatatype: (datatype: string) => void;
};
const URLS = {
    datasetfile: "./datasets_merged.json",
    datatypefile: "./datatypes_merged.json",
    dataSetUrl: "http://localhost:8080/data-set",

}
const Dropdown: React.FC<Props> =
    ({ setSelectedDataset, setSelectedDatatype }) => {

        const [explanationData, setExplanationData] = useState<any>(null);

        useEffect(() => {

            const fetchData = async () => {
                try {
                    const dataSet_response = await fetch(URLS.datasetfile);
                    const dataset = await dataSet_response.json();
                    const datatype_response = await fetch(URLS.datatypefile);
                    const datatype = await datatype_response.json();
                    const dataset_available_response = await fetch(URLS.dataSetUrl);
                    const dataset_available = await dataset_available_response.json();

                    // Map each dataset name to a key-value pair, here the value is an empty object
                    const d = {
                        "dataset": Object.fromEntries(
                            dataset_available.dataSet.map((name: string | number) => [name, dataset[name]])
                        ),
                        "datatype": Object.fromEntries(
                            dataset_available.dataType.map((name: string | number) => [name, datatype[name]])
                        )
                    };
                    setExplanationData(d);



                } catch (error) {
                    console.error("Error fetching explanation data:", error);
                }
            };
            fetchData();

        }, []);

        const handleSelectedDatatypes = (event: React.ChangeEvent<HTMLSelectElement>) => {

            setSelectedDatatype(event.target.value);
        }
        const handleSelectedDatasets = (event: React.ChangeEvent<HTMLSelectElement>) => {

            setSelectedDataset(event.target.value);
        }

        return (
            <div className="d-flex flex-column align-items-start gap-2">


                <label className="text-bold text-dark">Datasets</label>

                <select onChange={handleSelectedDatasets} className="form-control">
                    <option >Select</option>
                    {explanationData && Object.keys(explanationData.dataset).map((key) => (
                        <option key={key} value={key}>
                            {/* Display the explanation if available, otherwise use the key */}
                            {explanationData.dataset[key] ? `${explanationData.dataset[key]} (${key})` : key}
                        </option>
                    ))}
                </select>
                <label className="text-bold text-dark">Datatypes</label>
                <select onChange={handleSelectedDatatypes} className="form-control">
                    <option >Select</option>
                    {explanationData && Object.keys(explanationData.datatype).map((key) => (
                        <option key={key} value={key}>
                            {explanationData.datatype[key] ? `${explanationData.datatype[key]} (${key})` : key}
                        </option>
                    ))}
                </select>
            </div>
        );

    }
export default Dropdown;