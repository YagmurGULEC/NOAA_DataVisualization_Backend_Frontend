package dev.noaa.backend.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;
import java.time.LocalDate;
public class StationDataId implements Serializable {

    private String station;   // station_id
    private LocalDate date;
    private String datasetName;
    private String datatype;

    public StationDataId() {}

    public StationDataId(String station, LocalDate date, String datasetName, String datatype) {
        this.station = station;
        this.date = date;
        this.datasetName = datasetName;
        this.datatype = datatype;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StationDataId that = (StationDataId) o;
        return station.equals(that.station) &&
                date.equals(that.date) &&
                datasetName.equals(that.datasetName) &&
                datatype.equals(that.datatype);
    }

    @Override
    public int hashCode() {
        return Objects.hash(station, date, datasetName, datatype);
    }
}
