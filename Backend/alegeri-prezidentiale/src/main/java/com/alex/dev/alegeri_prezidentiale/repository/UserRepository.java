package com.alex.dev.alegeri_prezidentiale.repository;
import com.alex.dev.alegeri_prezidentiale.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User, String> {
    Optional<User> findById(String id);
    Optional<User> findByEmail(String email);

    //Find all users with electionParticipation = true and paginate the results.
    Page<User> findByElectionParticipationTrue(Pageable pageable);
}
