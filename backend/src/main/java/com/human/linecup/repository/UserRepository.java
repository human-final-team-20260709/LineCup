package com.human.linecup.repository;

import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.User;
import com.human.linecup.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmpNo(String empNo);

    Optional<User> findByNameAndEmail(String name, String email);

    Optional<User> findByEmpNoAndEmail(String empNo, String email);

    Optional<User> findByEmpNoAndNameAndEmail(String empNo, String name, String email);

    boolean existsByEmpNo(String empNo);

    boolean existsByEmail(String email);

    List<User> findByApprovalStatusOrderByCreatedAtDesc(ApprovalStatus approvalStatus);

    long countByActiveTrue();

    long countByRole(UserRole role);

    long countByApprovalStatus(ApprovalStatus approvalStatus);

    @Query("""
            select u
            from User u
            where (:role is null or u.role = :role)
              and (:keyword is null or :keyword = ''
                   or lower(u.empNo) like lower(concat('%', :keyword, '%'))
                   or lower(u.name) like lower(concat('%', :keyword, '%'))
                   or lower(u.email) like lower(concat('%', :keyword, '%')))
            """)
    Page<User> search(
            @Param("keyword") String keyword,
            @Param("role") UserRole role,
            Pageable pageable
    );
}
