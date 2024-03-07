package edu.ucsb.cs156.organic.repositories;

import edu.ucsb.cs156.organic.entities.School;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

// check if this stuff is correct
@Repository
public interface SchoolRepository extends CrudRepository<School, String /* might need to change this data type */> {
    Iterable<School> findByAbbreviation(String abbreviation);
    Iterable<School> findByName(String name);
    Optional<School> findByAbbreviationAndName(String abbreviation, String name);
}