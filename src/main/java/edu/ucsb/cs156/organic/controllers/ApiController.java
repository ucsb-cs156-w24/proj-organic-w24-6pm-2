package edu.ucsb.cs156.organic.controllers;

import edu.ucsb.cs156.organic.errors.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;

import edu.ucsb.cs156.organic.models.CurrentUser;
import edu.ucsb.cs156.organic.services.CurrentUserService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

@Slf4j
public abstract class ApiController {
  @Autowired
  private CurrentUserService currentUserService;

  protected CurrentUser getCurrentUser() {
    return currentUserService.getCurrentUser();
  }
  
  protected Object genericMessage(String message) {
    return Map.of("message", message);
  }

  @ExceptionHandler({ EntityNotFoundException.class })
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Object handleGenericException(Throwable e) {
    log.error("EntityNotFoundException: {}", e.getMessage());
    return Map.of(
      "type", e.getClass().getSimpleName(),
      "message", e.getMessage()
    );
  }

  @ExceptionHandler({ RuntimeException.class})
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Object handleBadRequest(Throwable e) {
    log.error("RuntimeException: {}", e.getMessage());
    return Map.of(
      "type", e.getClass().getSimpleName(),
      "message", e.getMessage()
    );
  }

  @ExceptionHandler({ Exception.class})
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Object handleException(Throwable e) {
    log.error("Exception: {}", e.getMessage());
    return Map.of(
      "type", e.getClass().getSimpleName(),
      "message", e.getMessage()
    );
  }

}
