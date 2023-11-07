package edu.ucsb.cs156.organic.controllers;

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
  
  @ExceptionHandler({ IllegalArgumentException.class})
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Object handleIllegalArgumentException(Throwable e) {
    Map<String,String> map =  Map.of(
      "type", e.getClass().getSimpleName(),
      "message", e.getMessage()
    );
    log.error("Exception thrown: {}", map);
    return map;
  }

}
