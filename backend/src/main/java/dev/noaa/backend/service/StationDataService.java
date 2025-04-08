package dev.noaa.backend.service;
import dev.noaa.backend.model.Station;
import dev.noaa.backend.repository.StationDataRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StationDataService {
    private final StationDataRepo stationDataRepo;
    public StationDataService(StationDataRepo stationDataRepo) {
        this.stationDataRepo = stationDataRepo;
    }
    public List<List<LocalDate>> findMinMaxDates() {
        return stationDataRepo.findMinMaxDates();
    }

    public List<Object[]> getDataSet() {

        return stationDataRepo.getDataSet();
    }

}
