package dev.noaa.backend.repository;
import dev.noaa.backend.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface StationRepo extends JpaRepository<Station, String> {
    @Query("SELECT s FROM Station s JOIN FETCH s.stationData d WHERE d.date BETWEEN :start AND :end AND d.datatype = :datatype AND d.datasetName = :datasetName")
    List<Station> fetchStationsWithFilteredData(LocalDate start, LocalDate end, String datatype, String datasetName);

}
