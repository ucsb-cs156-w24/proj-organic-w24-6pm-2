package edu.ucsb.cs156.organic.entities;

import lombok.*;

import javax.persistence.*;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "users")
public class User {
  @Id
  private Integer githubId;
  private String githubNodeId;
  private String githubLogin;
  private String email;
  private String pictureUrl;
  private String fullName;
  private boolean emailVerified;
  private boolean admin;
  private boolean instructor;
  private String accessToken;

  @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)  @Fetch(FetchMode.JOIN)
  private List<UserEmail> emails;

  @Builder.Default
  private Instant lastOnline = Instant.now();

  @Override
  public String toString() {
    return String.format("User: githubId=%d githubLogin=%s", githubId, githubLogin);
  }
}
