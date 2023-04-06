package com.example.lthdv.service;

import com.example.lthdv.model.CardInfo;
import com.example.lthdv.model.Trip;
import com.example.lthdv.repository.CardInfoRepository;
import com.example.lthdv.repository.TripRepository;
import com.example.lthdv.service.dto.ResponsePayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaymentTripService {
    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private CardInfoRepository cardInfoRepository;

    public List<Trip> getTrips(String username) {
        return tripRepository.findAllByUsername(username);
    }

    public ResponsePayment paymentTrip(Long totalMoney, String name, String type, String cardNumber,
                                       String cvc, String expirationDate, String username) {
        Optional<CardInfo> cardInfoOptional = cardInfoRepository.findByNameAndTypeAndCardNumberAndCvcAndExpirationDate(name, type, cardNumber, cvc, expirationDate);

        List<Trip> notPaidTrips = tripRepository.findAllByUsernameAndPaid(username, false);

        if(notPaidTrips == null || notPaidTrips.size() == 0) {
            return new ResponsePayment(200, "Bạn đã thanh toán trước đó!!! ");
        }

        if(cardInfoOptional.isEmpty()) return new ResponsePayment(404, "Không tìm thấy thẻ");
        if(totalMoney > cardInfoOptional.get().getMoney()) {
            return new ResponsePayment(400, "Bạn không có đủ tiền để thanh toán");
        }
        try {
            CardInfo cardInfo = cardInfoOptional.get();
            cardInfo.setMoney(cardInfo.getMoney() - totalMoney);
            cardInfoRepository.save(cardInfo);

            // update trip is paid
            tripRepository.paidTrips(username);

            return new ResponsePayment(200, "Bạn đã thanh toán thành công");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponsePayment(500, "Có lỗi xảy ra khi thanh toán");
    }

}
