package com.example.lthdv.repository;

import com.example.lthdv.model.CardInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardInfoRepository extends JpaRepository<CardInfo, Long> {
    Optional<CardInfo> findByNameAndTypeAndCardNumberAndCvcAndExpirationDate(String name, String type, String cardNumber, String cvc, String ExpirationDate);
}
