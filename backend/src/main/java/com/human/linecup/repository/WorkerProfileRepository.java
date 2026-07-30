package com.human.linecup.repository;

import com.human.linecup.entity.WorkerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, Long> {

    @EntityGraph(attributePaths = {"user", "primaryProcess"})
    Optional<WorkerProfile> findByUserUserId(Long userId);

    boolean existsByUserUserId(Long userId);

    @EntityGraph(attributePaths = {"user", "primaryProcess"})
    List<WorkerProfile> findAllByOrderByUserEmpNoAsc();

    @EntityGraph(attributePaths = {"user", "primaryProcess"})
    @Query("""
            select wp
            from WorkerProfile wp
            join wp.user u
            join wp.primaryProcess mp
            where (:keyword is null or :keyword = ''
                   or lower(u.empNo) like lower(concat('%', :keyword, '%'))
                   or lower(u.name) like lower(concat('%', :keyword, '%'))
                   or lower(wp.teamName) like lower(concat('%', :keyword, '%'))
                   or lower(mp.processCode) like lower(concat('%', :keyword, '%'))
                   or lower(mp.processName) like lower(concat('%', :keyword, '%')))
            """)
    Page<WorkerProfile> search(@Param("keyword") String keyword, Pageable pageable);
}
