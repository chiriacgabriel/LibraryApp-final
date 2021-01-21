package com.library.dto;

import com.library.model.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookDto {

    private int id;

    private String title;

    private Author author;

    private int stock;

    private LocalDate processedDate;

    private BookImageUrl bookImageUrl;

    private BookCategory bookCategory;

    private Fictional fictional;

    private Nonfictional nonfictional;

}
