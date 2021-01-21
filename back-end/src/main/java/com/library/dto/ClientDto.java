package com.library.dto;

import com.library.model.Reservation;
import lombok.*;

import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDto {

    private int id;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private List<Reservation> reservationList;

}
