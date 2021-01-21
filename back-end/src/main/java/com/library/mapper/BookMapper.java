package com.library.mapper;

import com.library.dto.BookDto;
import com.library.model.Book;
import org.springframework.stereotype.Service;

@Service
public class BookMapper {

    public Book map(BookDto bookDto) {
        Book book = Book.builder()
                .title(bookDto.getTitle())
                .author(bookDto.getAuthor())
                .stock(bookDto.getStock())
                .processedDate(bookDto.getProcessedDate())
                .bookImageUrl(bookDto.getBookImageUrl())
                .bookCategory(bookDto.getBookCategory())
                .fictional(bookDto.getFictional())
                .nonfictional(bookDto.getNonfictional())
                .build();

        return book;
    }

    public BookDto map(Book book) {
        BookDto bookDto = BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .stock(book.getStock())
                .processedDate(book.getProcessedDate())
                .bookImageUrl(book.getBookImageUrl())
                .bookCategory(book.getBookCategory())
                .fictional(book.getFictional())
                .nonfictional(book.getNonfictional())
                .build();
        return bookDto;
    }
}
