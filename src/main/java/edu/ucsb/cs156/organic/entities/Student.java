package edu.ucsb.cs156.organic.entities;

import lombok.*;

import javax.persistence.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "entstudent")
public class Student {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  private Long courseId;
  private String fname;
  private String lname;
  private String studentId;
  private String email;
  
  private Integer githubId;

  @OneToOne
  @JoinColumn(name = "githubId", referencedColumnName = "githubId", insertable = false, updatable = false)
  private User user;
}
