package edu.ucsb.cs156.organic.repositories;

import edu.ucsb.cs156.organic.entities.Course;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CourseRepository extends CrudRepository<Course, Integer> {

}
