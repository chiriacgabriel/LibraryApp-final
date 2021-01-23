package com.library.validator;

import com.library.dto.BookDto;
import com.library.exception.*;
import com.library.model.Book;
import com.library.model.Reservation;
import com.library.repository.BookRepository;
import com.library.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookDtoValidator {

    private BookRepository bookRepository;
    private ReservationRepository reservationRepository;

    @Autowired
    public BookDtoValidator(BookRepository bookRepository, ReservationRepository reservationRepository) {
        this.bookRepository = bookRepository;
        this.reservationRepository = reservationRepository;
    }

    public void validate(BookDto bookDto) {
        if (bookDto.getAuthor() == null) {
            throw new BookNoAuthorException();
        }
        if (bookDto.getBookCategory() == null) {
            throw new BookNoCategoryException();
        }
        if (bookDto.getFictional() == null && bookDto.getNonfictional() == null) {
            throw new BookNoTypeSelectedException();
        }
    }

    public void validate(int id) {
        Optional<Book> optionalBook = bookRepository.findById(id);

        if (!optionalBook.isPresent()) {
            throw new BookIsNotPresentException();
        }

        List<Reservation> reservationList = reservationRepository.findAllByBookListContains(optionalBook.get());

        if (!reservationList.isEmpty()) {
            throw new BookHasReservationException();
        }
    }
}
