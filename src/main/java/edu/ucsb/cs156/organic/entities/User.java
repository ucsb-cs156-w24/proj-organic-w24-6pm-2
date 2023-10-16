package edu.ucsb.cs156.organic.entities;

import lombok.*;

import javax.persistence.*;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  private String email;
  private String pictureUrl;
  private String fullName;
  private String givenName;
  private String familyName;
  private boolean emailVerified;
  private String locale;
  private boolean admin;
  private boolean instructor;

  @Builder.Default
  private Instant lastOnline = Instant.now();

  @Override
  public String toString() {
    return String.format("User: id=%d email=%s", id, email);
  }
}
