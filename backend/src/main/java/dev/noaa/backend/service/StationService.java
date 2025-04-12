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
        return stationRepo.fetchStations(startDate, endDate, datatype, datasetName);
    }
    public List<Station> fetchFlatDataByDataset(LocalDate startDate, LocalDate endDate, String datasetName) {
        return stationRepo.fetchStationsByDataset(startDate, endDate,  datasetName);
    }
    public List<Station> fetchFlatDataByDatasetDataTypeExactDate(LocalDate date, String datatype, String datasetName) {
        return stationRepo.fetchStationsByDatasetDataTypeExactDate(date, datatype, datasetName);
    }
}
