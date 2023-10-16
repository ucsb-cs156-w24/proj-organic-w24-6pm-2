package edu.ucsb.cs156.organic.repositories.jobs;

import edu.ucsb.cs156.organic.entities.jobs.Job;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Repository
public interface JobsRepository extends CrudRepository<Job, Long> {
    public Page<Job> findAll(Pageable pageable);
}
