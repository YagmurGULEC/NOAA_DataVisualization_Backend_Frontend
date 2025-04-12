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

    @GetMapping("/data")
    public List<Station> getStationsWithData(
            @RequestParam(value="startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value="datatype", required=false) String datatype,
            @RequestParam("datasetName") String datasetName) {
        
           if (datatype != null && !datatype.isEmpty()) {
            return stationService.fetchFlatDataRaw(startDate, endDate, datatype, datasetName);   
        } else {
            return stationService.fetchFlatDataByDataset(startDate, endDate, datasetName);
        }  
       
    }
    @GetMapping("/data/exact")
    public List<Station> getStationsWithExactDateData(
            @RequestParam(value="date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("datatype") String datatype,
            @RequestParam("datasetName") String datasetName) {
        return stationService.fetchFlatDataByDatasetDataTypeExactDate(date, datatype, datasetName);
            }
    
}
