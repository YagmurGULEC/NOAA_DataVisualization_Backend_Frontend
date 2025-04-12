package dev.noaa.backend.model;
import jakarta.persistence.*;
import dev.noaa.backend.util.StationGeoJsonSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.locationtech.jts.geom.Point;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.List;

@Entity
@Table(name = "stations", schema = "geo")
@JsonSerialize(using = StationGeoJsonSerializer.class)
public class Station {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;


    @Column(name = "geom", columnDefinition = "geometry(Point,4326)")
    private Point geom;
    public Station() {
    }
    public Station(String id, String name, Point geom) {
        this.id = id;
        this.name = name;
        this.geom = geom;
    }

    public Point getGeom() {
        return geom;
    }

    public String getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StationData> stationData;
    public List<StationData> getStationData() {
        return stationData;
    }
}
