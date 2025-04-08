package dev.noaa.backend.model;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "station_data", schema = "geo")
@IdClass(StationDataId.class)
public class StationData {
    @Id
    @Column(name = "date")
    private LocalDate date;

    @Id
    @Column(name = "dataset_name")
    private String datasetName;

    @Id
    @Column(name = "datatype")
    private String datatype;

    @Column(name = "value")
    private Float value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;
    public StationData() {
    }
    public Station getStation() { return station; }
    public void setStationId(Station station) { this.station = station; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDatasetName() { return datasetName; }
    public void setDatasetName(String datasetName) { this.datasetName = datasetName; }

    public String getDatatype() { return datatype; }
    public void setDatatype(String datatype) { this.datatype = datatype; }

    public Float getValue() { return value; }
    public void setValue(Float value) { this.value = value; }
    public void setStation(Station station) { this.station = station; }

}
