package edu.ucsb.cs156.organic.advice;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;


/**
 * This class handles exceptions thrown by the controllers.
 */
@Slf4j
@RestControllerAdvice
public class OrganicControllerAdvice {

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public void handleIllegalArgumentException() {
        log.error("IllegalArgumentException thrown");
    }

}