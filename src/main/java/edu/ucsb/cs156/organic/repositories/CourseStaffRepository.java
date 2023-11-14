package edu.ucsb.cs156.organic.repositories;

import edu.ucsb.cs156.organic.entities.CourseStaff;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseStaffRepository extends CrudRepository<CourseStaff, Integer> {
    Iterable<CourseStaff> findByCourseId(Long courseId);
    Iterable<CourseStaff> findByGithubId(Integer githubId);
    Optional<CourseStaff> findById(Long id);
}
