package com.library.controller;

import com.library.dto.LibraryEmailDto;
import com.library.services.LibraryEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.xml.bind.ValidationException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(value = "/api/email", produces = "application/json")
public class LibraryEmailRestController {

    private LibraryEmailService libraryEmailService;

    @Autowired
    public LibraryEmailRestController(LibraryEmailService libraryEmailService) {
        this.libraryEmailService = libraryEmailService;
    }

    @PostMapping
    public ResponseEntity<?> sendEmail(@Valid @RequestBody LibraryEmailDto libraryEmailDto, BindingResult bindingResult) throws ValidationException {
        if (bindingResult.hasErrors()) {
            throw new ValidationException("Email is not valid");
        }

        libraryEmailService.sendEmailTo(libraryEmailDto);
        libraryEmailService.saveEmail(libraryEmailDto);

        return ResponseEntity.ok().build();
    }
}
