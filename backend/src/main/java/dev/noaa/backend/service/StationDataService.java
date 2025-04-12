package dev.noaa.backend.service;
import dev.noaa.backend.model.Station;
import dev.noaa.backend.repository.StationDataRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

@Service
public class StationDataService {
    private final StationDataRepo stationDataRepo;
    public StationDataService(StationDataRepo stationDataRepo) {
        this.stationDataRepo = stationDataRepo;
    }
    
    public List<Object[]> getDataSet() {
        return stationDataRepo.getDataSet();
      
    }
    public List<LocalDate> getDatesByDatatypeAndDatasetName(String datatype, String datasetName) {
        return stationDataRepo.findDatesByDatatypeAndDatasetName(datatype, datasetName);
    }
    
}
