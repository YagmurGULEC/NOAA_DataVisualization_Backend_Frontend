package dev.noaa.backend.controller;
import dev.noaa.backend.model.Station;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import dev.noaa.backend.service.StationService;

import java.util.List;
import java.util.Date;
import java.time.LocalDate;

@RestController
public class StationController {
    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping("/stations")
    public String getStations() {
        return "Hello, NOAA!";
    }
    @GetMapping("/data")
    public List<Station> getStationsWithData(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam("datatype") String datatype,
            @RequestParam("datasetName") String datasetName) {
        System.out.println("Start: " + startDate + ", End: " + endDate);
        return stationService.fetchFlatDataRaw(startDate, endDate, datatype, datasetName);
    }
}
