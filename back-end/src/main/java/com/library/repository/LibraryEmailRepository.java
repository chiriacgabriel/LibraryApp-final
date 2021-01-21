package com.library.repository;

import com.library.model.LibraryEmail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibraryEmailRepository extends JpaRepository<LibraryEmail, Integer> {

}
