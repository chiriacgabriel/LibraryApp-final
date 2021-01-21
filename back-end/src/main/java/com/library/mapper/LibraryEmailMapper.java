package com.library.mapper;

import com.library.config.EmailConfig;
import com.library.dto.LibraryEmailDto;
import com.library.model.LibraryEmail;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

@Service
public class LibraryEmailMapper {

    private EmailConfig emailConfig;

    public LibraryEmailMapper(EmailConfig emailConfig) {
        this.emailConfig = emailConfig;
    }

    public LibraryEmail map(LibraryEmailDto libraryEmailDto) {
        return LibraryEmail.builder()
                .subject(libraryEmailDto.getSubject())
                .email(libraryEmailDto.getEmail())
                .emailBody(libraryEmailDto.getEmailBody())
                .build();
    }

    public LibraryEmailDto map(LibraryEmail libraryEmail) {
        return LibraryEmailDto.builder()
                .subject(libraryEmail.getSubject())
                .email(libraryEmail.getEmail())
                .emailBody(libraryEmail.getEmailBody())
                .build();
    }

    public void mapEmail(LibraryEmailDto libraryEmailDto) {
        // Create a mail sender

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(emailConfig.getHost());
        mailSender.setPort(emailConfig.getPort());
        mailSender.setPassword(emailConfig.getPassword());
        mailSender.setUsername(emailConfig.getUsername());

        // Create an email instance

        LibraryEmail libraryEmail = map(libraryEmailDto);

        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(libraryEmail.getEmail());
        simpleMailMessage.setTo("officialwebitech@gmail.com");
        simpleMailMessage.setSubject(libraryEmail.getSubject());
        simpleMailMessage.setText(libraryEmail.getEmailBody());

        // Send mail

        mailSender.send(simpleMailMessage);
    }
}
