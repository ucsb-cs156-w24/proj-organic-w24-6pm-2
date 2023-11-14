package edu.ucsb.cs156.organic.entities;

import lombok.*;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "staff")
public class Staff {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  private Long courseId;
  private Integer githubId;

  @OneToOne
  @JoinColumn(name = "githubId", referencedColumnName = "githubId", insertable = false, updatable = false)
  private User user;
}
