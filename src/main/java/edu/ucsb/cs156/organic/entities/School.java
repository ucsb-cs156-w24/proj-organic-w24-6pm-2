package edu.ucsb.cs156.organic.entities;

import lombok.*;

import javax.persistence.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "schools")
public class School {
    // is the @Id necessary?
  @Id
  private String abbreviation;
  private String name;
  private String termRegex;
  private String termDescription;
  private String termError;
  
}