# Step 1: Build the application with Gradle
FROM gradle:8.13-jdk-21-and-24-alpine as build
WORKDIR /app


COPY gradle ./gradle
COPY gradlew ./

# Run a dummy build to cache dependencies
RUN ./gradlew build -x test || return 0

# Now copy the full source and build again
COPY . .

# Build the Spring Boot application (skip tests for faster builds)
RUN ./gradlew bootJar -x test

# Step 2: Use a lightweight runtime image
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
