package edu.ucsb.cs156.organic.repositories;

import edu.ucsb.cs156.organic.entities.Course;
import edu.ucsb.cs156.organic.entities.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
  Optional<User> findByGithubId(Integer githubId);
  Optional<User> findByGithubLogin(String githubLogin);

   @Query("select c from courses c where c.id in (select cs.courseId from staff cs where cs.githubId = :githubId)")
   public Iterable<Course> findCoursesStaffedByUser(Integer githubId);
}
