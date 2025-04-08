package dev.noaa.backend.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import dev.noaa.backend.service.StationDataService;
import java.time.LocalDate;
import java.util.*;

@RestController
public class StationDataController {
    public final StationDataService stationDataService;


    public StationDataController(StationDataService stationDataService) {
        this.stationDataService = stationDataService;
    }

    @GetMapping("/data-range")
    public Map<String, String> getMinMaxDates() {

        List<List<LocalDate>> minMaxDates = stationDataService.findMinMaxDates();

        Map<String,String> response = new HashMap<>();
        response.put("minDate", minMaxDates.get(0).get(0).toString());
        response.put("maxDate", minMaxDates.get(0).get(1).toString());
        return response;
    }

    @GetMapping("/data-set")
    public Map<String, List> getDataSet() {
        List<Object[]> result = stationDataService.getDataSet();

        Set<String> dataTypes = new HashSet<>();
        Set<String> datasetNames = new HashSet<>();
        Map<String,List> dataSets = new HashMap<>();
        for(Object [] objs : result){
            dataTypes.add(objs[0].toString());
            datasetNames.add(objs[1].toString());
        }
        dataSets.put("dataTypes", new ArrayList<>(dataTypes));
        dataSets.put("datasetNames", new ArrayList<>(datasetNames));
        return dataSets;
    }
}
