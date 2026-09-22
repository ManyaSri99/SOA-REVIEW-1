package com.hostelbooking.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hostel_id", nullable = false)
    @JsonIgnore
    private Hostel hostel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(nullable = false)
    private String roomNumber;

    @Column(nullable = false)
    private String status = "AVAILABLE";

    @Column(nullable = false)
    private Integer availableRooms = 1;

    @Column(nullable = false)
    private Double pricePerHour = 0.0;

    @Column(nullable = false)
    private Double pricePerDay = 0.0;

    @Column(columnDefinition = "TEXT")
    private String facilities;
}