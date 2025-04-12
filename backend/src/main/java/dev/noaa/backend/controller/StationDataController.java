package dev.noaa.backend.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.format.annotation.DateTimeFormat;
import dev.noaa.backend.service.StationDataService;
import java.time.LocalDate;
import java.util.*;

@RestController
public class StationDataController {
    public final StationDataService stationDataService;


    public StationDataController(StationDataService stationDataService) {
        this.stationDataService = stationDataService;
    }



    @GetMapping("/data-set")
    public Map<String, List> getDataSet() {
   
        
         List<Object []> result = stationDataService.getDataSet();
         Set<String> datasets = new HashSet<>();
         Set<String> datatypes = new HashSet<>();
        result.forEach(row -> {
            String datasetName = (String) row[1];
            String datatype = (String) row[0];
            datasets.add(datasetName);
            datatypes.add(datatype);
            
        });
        
        Map<String, List> dataSets = new HashMap<>();
        dataSets.put("dataSet", new ArrayList<>(datasets));
        dataSets.put("dataType", new ArrayList<>(datatypes));
        return dataSets;
    }
    @GetMapping("/dates")
    public List<LocalDate> getDatesByDatatypeAndDatasetName(
            @RequestParam("datatype") String datatype,
            @RequestParam("datasetName") String datasetName) {
        return stationDataService.getDatesByDatatypeAndDatasetName(datatype, datasetName);
            }
   
    
}
