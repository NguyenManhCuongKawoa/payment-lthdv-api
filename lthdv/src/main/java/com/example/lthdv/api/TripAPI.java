package com.example.lthdv.api;

import com.example.lthdv.model.Trip;
import com.example.lthdv.service.PaymentTripService;
import com.example.lthdv.service.dto.RequestPayment;
import com.example.lthdv.service.dto.ResponsePayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/trip")
public class TripAPI {
    @Autowired
    private PaymentTripService paymentTripService;

    @GetMapping("find-all/{username}")
    public ResponseEntity<?> getTripsByUsername(@PathVariable String username) {

        List<Trip> trips = paymentTripService.getTrips(username);

        return ResponseEntity.ok(trips);
    }

    @PostMapping("payment/{username}")
    public ResponseEntity<?> paymentTripsOfUsername(@PathVariable String username, @RequestBody RequestPayment requestPayment) {

        ResponsePayment responsePayment = paymentTripService.paymentTrip(
                requestPayment.getMoney(),
                requestPayment.getName(),
                requestPayment.getType(),
                requestPayment.getCardNumber(),
                requestPayment.getCvc(),
                requestPayment.getExpirationDate(),
                username
        );

        if(responsePayment.getCode() == 200) {
            return ResponseEntity.ok(responsePayment);
        }
        return ResponseEntity.badRequest().body(responsePayment);
    }
}
