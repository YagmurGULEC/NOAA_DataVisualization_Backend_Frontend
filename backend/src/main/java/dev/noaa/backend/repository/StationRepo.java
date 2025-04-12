package dev.noaa.backend.repository;
import dev.noaa.backend.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface StationRepo extends JpaRepository<Station, String> {
     @Query("SELECT s FROM Station s JOIN FETCH s.stationData sd " +
            "WHERE sd.date BETWEEN :start AND :end " +
            "AND sd.datatype = :datatype " +
            "AND sd.datasetName = :datasetName")
    
    List<Station> fetchStations(LocalDate start, LocalDate end, String datatype,String datasetName);

    @Query("SELECT s FROM Station s JOIN FETCH s.stationData sd " +
            "WHERE sd.date BETWEEN :start AND :end " +
            "AND sd.datasetName = :datasetName")
    
    List<Station> fetchStationsByDataset(LocalDate start, LocalDate end, String datasetName);

    @Query("SELECT s FROM Station s JOIN FETCH s.stationData sd " +
            "WHERE sd.date = :date " +
            "AND sd.datasetName = :datasetName AND sd.datatype = :datatype")
    
    List<Station> fetchStationsByDatasetDataTypeExactDate(LocalDate date, String datatype, String datasetName);


}
