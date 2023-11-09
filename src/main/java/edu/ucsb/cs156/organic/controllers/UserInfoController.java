package edu.ucsb.cs156.organic.controllers;

import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.entities.UserEmail;
import edu.ucsb.cs156.organic.models.CurrentUser;
import edu.ucsb.cs156.organic.repositories.UserEmailRepository;
import edu.ucsb.cs156.organic.repositories.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import io.swagger.v3.oas.annotations.Operation;

import java.time.Instant;
import java.util.List;

import org.kohsuke.github.GHEmail;
import org.kohsuke.github.GHMyself;
import org.kohsuke.github.GHUser;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Tag(name = "Current User Information")
@RequestMapping("/api/currentUser")
@RestController
public class UserInfoController extends ApiController {
  @Autowired
  private UserRepository userRepository;

  // @Autowired
  // private UserEmailRepository userEmailRepository;

  // @Autowired
  // OAuth2AuthorizedClientService clientService;

  @Operation(summary = "Get information about current user")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("")
  public CurrentUser getCurrentUser() {
    return super.getCurrentUser();
  }

  @Operation(summary = "Update user's last online time")
  @PreAuthorize("hasRole('ROLE_USER')")
  @PostMapping("/last-online")
  public ResponseEntity<Instant> updateLastOnline() {
    User user = super.getCurrentUser().getUser();
    Instant timeNow = Instant.now();
    if (user != null) {
      user.setLastOnline(timeNow);
    }
    return ResponseEntity.ok().body(timeNow);
  }
}
