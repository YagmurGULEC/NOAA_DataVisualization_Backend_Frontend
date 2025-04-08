package dev.noaa.backend.service;
import dev.noaa.backend.model.Station;
import dev.noaa.backend.repository.StationRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StationService {
    private final StationRepo stationRepo;

    public StationService(StationRepo stationRepo) {
        this.stationRepo = stationRepo;
    }
    public List<Station> fetchFlatDataRaw(LocalDate startDate, LocalDate endDate, String datatype, String datasetName) {
        return stationRepo.fetchStationsWithFilteredData(startDate, endDate, datatype, datasetName);
    }


}
