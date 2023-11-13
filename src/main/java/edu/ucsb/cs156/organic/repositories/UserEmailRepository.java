package edu.ucsb.cs156.organic.repositories;

import edu.ucsb.cs156.organic.entities.UserEmail;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserEmailRepository extends CrudRepository<UserEmail, String> {
    Iterable<UserEmail> findByUserGithubId(Long userGithubId);
}
