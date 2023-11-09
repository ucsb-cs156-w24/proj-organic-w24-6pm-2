package edu.ucsb.cs156.organic.testconfig;

import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.services.CurrentUserServiceImpl;

@Slf4j
@Service("currentUser")
public class MockCurrentUserServiceImpl extends CurrentUserServiceImpl {

  public User getMockUser(SecurityContext securityContext, Authentication authentication) {
    Object principal = authentication.getPrincipal();

    String email = "user@example.org";
    String pictureUrl = "https://example.org/fake.jpg";
    String fullName = "Fake User";
    boolean emailVerified = true;
    boolean admin=false;
    Instant lastOnline = Instant.ofEpochSecond(100);

    org.springframework.security.core.userdetails.User user = null;


    if (principal instanceof org.springframework.security.core.userdetails.User) {
      log.info("principal instance of org.springframework.security.core.userdetails.User");
      user = (org.springframework.security.core.userdetails.User) principal;
      email = user.getUsername() + "@example.org";
      pictureUrl = "https://example.org/" +  user.getUsername() + ".jpg";
      fullName = "Fake " + user.getUsername();
      emailVerified = true;
      admin= (user.getUsername().equals("admin"));
    }

    User u = User.builder()
    .email(email)
    .pictureUrl(pictureUrl)
    .fullName(fullName)
    .emailVerified(emailVerified)
    .admin(admin)
    .githubId(123456)
    .lastOnline(lastOnline)
    .build();
    
    log.trace("************** ALERT **********************");
    log.trace("************* MOCK USER********************");
    log.trace("authentication={}",authentication);
    log.trace("securityContext={}",securityContext);
    log.trace("principal={}",principal);
    log.trace("user (spring security) ={}",user);
    log.trace("u (our custom user entity)={}",u);
    log.trace("************** END ALERT ******************");

    return u;
  }

  public User getUser() {
    SecurityContext securityContext = SecurityContextHolder.getContext();
    Authentication authentication = securityContext.getAuthentication();

    if (!(authentication instanceof OAuth2AuthenticationToken)) {
      return getMockUser(securityContext, authentication);
    }

    return null;
  }

}
