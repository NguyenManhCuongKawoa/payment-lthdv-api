package com.example.lthdv.repository;

import com.example.lthdv.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findAllByUsername(String username);
    List<Trip> findAllByUsernameAndPaid(String username, Boolean paid);

    @Modifying
    @Transactional
    @Query(value = "UPDATE trip SET paid = 1 where username = ?", nativeQuery = true)
    void paidTrips(String username);
}
