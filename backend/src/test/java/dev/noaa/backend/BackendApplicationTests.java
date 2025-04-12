package dev.noaa.backend;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.yml")
class BackendApplicationTests {
	// @Autowired
	// private MockMvc mockMvc;
	// @Autowired
	// private ObjectMapper objectMapper;
	// @ParameterizedTest
	// @CsvSource({
	// 		// Format: startDate, endDate, expectedFeatureCount
	// 		"2025-01-01,2025-01-02,GSOM,5545",
	// 		"2025-01-01,2025-01-03,GSOM,5591"  // Replace with your expected values for these ranges

	// })
	// void testGeoJsonDataEndpoint(String startDate,String endDate, String dataset, int expectedFeatureCount) throws Exception {

	// 	MvcResult result = mockMvc.perform(get("/data")
	// 					.param("startDate", startDate)
	// 					.param("endDate", endDate)
	// 					.param("datatype", "TAVG")
	// 					.param("datasetName", dataset)
	// 					.accept("application/json"))
	// 			.andExpect(status().isOk())
	// 			.andExpect(content().contentType("application/json"))
	// 			.andExpect(jsonPath("$").isArray())
	// 			.andExpect(jsonPath("$[0].type").value("Feature"))
	// 			.andExpect(jsonPath("$[0].geometry.type").value("Point"))
	// 			.andExpect(jsonPath("$[0].properties.id").isString())
	// 			.andReturn();
	// 	String json = result.getResponse().getContentAsString();
	// 	List<Map<String, Object>> features = objectMapper.readValue(
	// 			json, new TypeReference<>() {}
	// 	);
	// 	assertNotNull(features);
	// 	assertFalse(features.isEmpty());
	// 	features.forEach(feature -> {
	// 		assertEquals("Feature", feature.get("type"));
	// 		assertTrue(feature.get("geometry") instanceof Map);
	// 		assertTrue(feature.get("properties") instanceof Map);
	// 	});

	// }

	// @Test
	// void testMinMaxDatesEndpoint() throws Exception {
	// 	MvcResult result = mockMvc.perform(get("/data-range")
	// 					.accept("application/json"))
	// 			.andExpect(status().isOk())
	// 			.andExpect(content().contentType("application/json"))
	// 			.andExpect(jsonPath("$.minDate").isString())
	// 			.andExpect(jsonPath("$.maxDate").isString())
	// 			.andReturn();
	// 	String json = result.getResponse().getContentAsString();
	// 	Map<String, String> minMaxDates = objectMapper.readValue(
	// 			json, new TypeReference<>() {}
	// 	);
	// assertNotNull(minMaxDates.get("minDate"));
    // assertNotNull(minMaxDates.get("maxDate"));
		
	// }

	// @Test
	// void testDataSetEndpoint() throws Exception {
	// 	MvcResult result = mockMvc.perform(get("/data-set")
	// 					.accept("application/json"))
	// 			.andExpect(status().isOk())
	// 			.andExpect(content().contentType("application/json"))
	// 			.andExpect(jsonPath("$.dataTypes").isArray())
	// 			.andExpect(jsonPath("$.datasetNames").isArray())
	// 			.andReturn();
	// 	String json = result.getResponse().getContentAsString();
	// 	Map<String, List<String>> dataSets = objectMapper.readValue(
	// 			json, new TypeReference<>() {}
	// 	);
	// 	assertNotNull(dataSets.get("dataTypes"));
	// 	assertNotNull(dataSets.get("datasetNames"));
	// 	assertFalse(dataSets.get("dataTypes").isEmpty());
	// 	assertFalse(dataSets.get("datasetNames").isEmpty());
	// }

	// @Test
	// void testDataSetWithDateRange() throws Exception {
	// 	MvcResult result = mockMvc.perform(get("/data-set")
	// 					.param("startDate", "2025-01-01")
	// 					.param("endDate", "2025-01-02")
	// 					.accept("application/json"))
	// 			.andExpect(status().isOk())
	// 			.andExpect(content().contentType("application/json"))
	// 			.andExpect(jsonPath("$.dataTypes").isArray())
	// 			.andExpect(jsonPath("$.datasetNames").isArray())
	// 			.andReturn();
	// 	String json = result.getResponse().getContentAsString();
	// 	Map<String, List<String>> dataSets = objectMapper.readValue(
	// 			json, new TypeReference<>() {}
	// 	);

	// 	assertNotNull(dataSets.get("dataTypes"));
	// 	assertNotNull(dataSets.get("datasetNames"));
	// 	assertFalse(dataSets.get("dataTypes").isEmpty());
	// 	assertFalse(dataSets.get("datasetNames").isEmpty());
	// 	// System.out.println("Data Types: " + dataSets);
	// }

	// @Test
	// void TestTimeStamps() throws Exception {
	// 	MvcResult result = mockMvc.perform(get("/dates")
	// 					.param("startDate", "2025-01-01")
	// 					.param("endDate", "2025-02-02")
	// 					.accept("application/json"))
	// 			.andExpect(status().isOk())
	// 			.andExpect(content().contentType("application/json"))
	// 			.andReturn();
	// 	String json = result.getResponse().getContentAsString();

	// 	List<LocalDate> dates = objectMapper.readValue(
	// 			json, new TypeReference<>() {}
	// 	);
	// 	assertNotNull(dates);
	// 	System.out.println("Dates: " + dates);
		
	// }

	// @Test
	// void testMinMaxValuesByDateRange() throws Exception {
	// 	MvcResult result = mockMvc.perform(get("/min-max-values")
	// 					.param("startDate", "2025-01-01")
	// 					.param("endDate", "2025-01-02")
	// 					.param("datasetName", "GSOM")
	// 					.accept("application/json"))
	// 			.andExpect(status().isOk())
	// 			.andExpect(content().contentType("application/json"))
	// 			.andReturn();
	// 	String json = result.getResponse().getContentAsString();
	// 	// Deserialize as a Map<String, List<String>>
    // 	Map<String, List<String>> minMaxValues = objectMapper.readValue(
    //         json, new TypeReference<Map<String, List<String>>>() {}
    // 	);
    
	// 	assertNotNull(minMaxValues);
	// 	assertFalse(minMaxValues.isEmpty());
		
	// 	minMaxValues.forEach((key, value) -> {
	// 		assertNotNull(key);
	// 		assertNotNull(value);
	// 		assertFalse(value.isEmpty());
	// 	});
	// 	System.out.println("Min Max Values: " + minMaxValues);
		
	// }

}
