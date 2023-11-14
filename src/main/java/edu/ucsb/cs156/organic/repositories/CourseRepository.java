package edu.ucsb.cs156.organic.repositories;

import edu.ucsb.cs156.organic.entities.Course;
import liquibase.pro.packaged.Q;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


//  private String school;
//   private String term;
//   private LocalDateTime start;
//   private LocalDateTime end;
//   private String githubOrg;

@Repository
public interface CourseRepository extends CrudRepository<Course, Integer> {

   public Optional<Course> findById(Long id);

   @Query("select c from courses c where c.id in (select cs.courseId from course_staff cs where cs.githubId = :githubId)")
   public Iterable<Course> findCoursesStaffedByUser(Integer githubId);
}
