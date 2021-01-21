package com.library.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LibraryEmailDto {

    private int id;
    private String subject;
    private String email;

    private String emailBody;
}
