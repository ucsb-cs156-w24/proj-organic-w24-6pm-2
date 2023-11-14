package edu.ucsb.cs156.organic.services;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.kohsuke.github.GHEmail;
import org.kohsuke.github.GHMyself;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.entities.UserEmail;
import edu.ucsb.cs156.organic.models.CurrentUser;
import edu.ucsb.cs156.organic.repositories.UserEmailRepository;
import edu.ucsb.cs156.organic.repositories.UserRepository;

@Slf4j
@Service("currentUser")
public class CurrentUserServiceImpl extends CurrentUserService {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  GrantedAuthoritiesService grantedAuthoritiesService;

  @Autowired
  private UserEmailRepository userEmailRepository;

  @Autowired
  OAuth2AuthorizedClientService clientService;

  @Value("${app.admin.githubLogins}")
  final private List<String> adminGithubLogins = new ArrayList<String>();

  public CurrentUser getCurrentUser() {
    CurrentUser cu = CurrentUser.builder()
        .user(this.getUser())
        .roles(this.getRoles())
        .build();
    this.getRoles().forEach( (role) -> {
      log.info("role={}", role);
      if (role.getAuthority().equals("ROLE_ADMIN")) {
        cu.getUser().setAdmin(true);
      }
    });

    log.info("getCurrentUser returns {}", cu);
    return cu;
  }

  /**
   * Get the currently logged in user, or null if no user is logged in.
   */
  public User getUser() {
    SecurityContext securityContext = SecurityContextHolder.getContext();
    Authentication authentication = securityContext.getAuthentication();

    if (authentication instanceof OAuth2AuthenticationToken) {
      try {
        return getOAuth2AuthenticatedUser(securityContext, authentication);
      } catch (Exception e) {
        log.error("Exception thrown: {}", e);
        return null;
      }
    }
    return null;
  }

  /**
   * Get the currently logged in user, or null if no user is logged in.
   * 
   * @param securityContext
   * @param authentication
   * @return
   */
  public User getOAuth2AuthenticatedUser(SecurityContext securityContext, Authentication authentication) {
    OAuth2User oAuthUser = ((OAuth2AuthenticationToken) authentication).getPrincipal();

    log.trace("*** Available attributes directly from Github OAuth ***");
    oAuthUser.getAttributes().forEach((k, v) -> {
      log.trace("k={}, v={}", k, v);
    });

    String githubLogin = oAuthUser.getAttribute("login");
    Integer githubId = oAuthUser.getAttribute("id");

    User u = null;
    Optional<User> ou = userRepository.findById(githubId);
    if (ou.isPresent()) {
      u = ou.get();
    } else {
      u = User.builder()
          .githubId(githubId)
          .githubNodeId(oAuthUser.getAttribute("node_id"))
          .githubLogin(githubLogin)
          .pictureUrl(oAuthUser.getAttribute("avatar_url"))
          .fullName(oAuthUser.getAttribute("name"))
          .admin(adminGithubLogins.contains(githubLogin))
          .build();
      u = userRepository.save(u);
    }

    updateToken(u);
    updateUserFromGithubAPI(u);
    u = userRepository.save(u);
    return u;
  }

  public Collection<? extends GrantedAuthority> getRoles() {
    return grantedAuthoritiesService.getGrantedAuthorities();
  }

  public void updateToken(User user) {

    Authentication authentication = SecurityContextHolder
        .getContext()
        .getAuthentication();

    OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;

    OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
        oauthToken.getAuthorizedClientRegistrationId(),
        oauthToken.getName());
    if (client != null) {
      String accessToken = client.getAccessToken().getTokenValue();
      log.trace("accessToken={}", accessToken);
      user.setAccessToken(accessToken);
    } else {
      log.error("*** client is null; could not update github info for user ***");
    }
  }

  public void updateUserFromGithubAPI(User user) {

    String token = user.getAccessToken();

    if (token == null) {
      log.error("Unable to authenticate to github because token is null");
      return;
    }

    GitHub github = null;

    try {
      github = new GitHubBuilder().withOAuthToken(token).build();
    } catch (Exception e) {
      log.error("Unable to authenticate to github, Exception thrown: {}", e);
      return;
    }

    GHMyself myself = null;
    List<GHEmail> emails = null;
    try {
      myself = github.getMyself();
      user.setEmail(myself.getEmail());
      user.setPictureUrl(myself.getAvatarUrl());
      user.setGithubLogin(myself.getLogin());
    } catch (IOException e) {
      log.error("Unable to getMyself from github, IOException thrown: {}", e);
      return;
    }

    try {
      emails = myself.getEmails2();
    } catch (IOException e) {
      log.error("Unable to getEmails2 from github, IOException thrown: {}", e);
      return;
    }

    emails.forEach((email) -> {
      log.trace("email={}", email);
      if (email.isPrimary()) {
        user.setEmail(email.getEmail());
        if (email.isVerified()) {
          user.setEmailVerified(true);
        }
        userRepository.save(user);
      }
      UserEmail userEmail = UserEmail.builder()
          .user(user)
          .email(email.getEmail())
          .build();
      userEmailRepository.save(userEmail);
    });
  }

}