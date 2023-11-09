package edu.ucsb.cs156.organic.entities;

import lombok.*;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "useremails")
public class UserEmail {
  @Id
  private String email;

  @ManyToOne
  @JsonIgnore
  @JoinColumn(name = "userGithubId")
  private User user;

  // userID and commonsId are used by the frontend
  @JsonInclude
  public Integer getGithubId() {
    return user.getGithubId();
  }

}
