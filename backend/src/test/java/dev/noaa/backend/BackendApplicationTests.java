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
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;
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
	// 		"2025-01-01,2025-01-02,5545",
	// 		"2025-01-01,2025-01-03,5591"  // Replace with your expected values for these ranges
	// })
	// void testGeoJsonDataEndpoint(String startDate,String endDate, int expectedFeatureCount) throws Exception {

	// 	MvcResult result = mockMvc.perform(get("/data")
	// 					.param("startDate", startDate)
	// 					.param("endDate", endDate)
	// 					.param("datatype", "TAVG")
	// 					.param("datasetName", "GHCND")
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
	// 	System.out.println("For date range " + startDate + " to " + endDate + ", feature count = " + features.size());

	// 	// Assert expected count
	// 	assertThat(features.size()).isEqualTo(expectedFeatureCount);


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
	// 	System.out.println("Min date: " + minMaxDates.get("minDate"));
	// 	System.out.println("Max date: " + minMaxDates.get("maxDate"));
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
	// 	System.out.println("Data types: " + dataSets.get("dataTypes"));
	// 	System.out.println("Dataset names: " + dataSets.get("datasetNames"));
	// }

}
