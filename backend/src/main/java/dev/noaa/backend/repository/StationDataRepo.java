package dev.noaa.backend.repository;
import dev.noaa.backend.model.Station;
import dev.noaa.backend.model.StationData;
import dev.noaa.backend.model.StationDataId;
import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
public interface StationDataRepo extends JpaRepository<StationData, StationDataId>{
   @Query("SELECT MIN(d.date), MAX(d.date) FROM StationData d")
   List<List<LocalDate>> findMinMaxDates();

    @Query("SELECT DISTINCT d.datatype,d.datasetName FROM StationData d")
    List<Object[]> getDataSet();

}
