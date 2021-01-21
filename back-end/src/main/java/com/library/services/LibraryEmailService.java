package com.library.services;

import com.library.dto.LibraryEmailDto;
import com.library.mapper.LibraryEmailMapper;
import com.library.repository.LibraryEmailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LibraryEmailService {

    private LibraryEmailRepository libraryEmailRepository;
    private LibraryEmailMapper libraryEmailMapper;

    @Autowired
    public LibraryEmailService(LibraryEmailRepository libraryEmailRepository,
                               LibraryEmailMapper libraryEmailMapper) {
        this.libraryEmailRepository = libraryEmailRepository;
        this.libraryEmailMapper = libraryEmailMapper;
    }

    public void sendEmailTo(LibraryEmailDto libraryEmailDto) {
        libraryEmailMapper.mapEmail(libraryEmailDto);
    }

    public void saveEmail(LibraryEmailDto libraryEmailDto) {
        libraryEmailRepository.save(libraryEmailMapper.map(libraryEmailDto));
    }
}
