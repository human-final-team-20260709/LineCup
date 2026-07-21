package com.human.linecup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.human.linecup.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    /** 3.3/3.7 지시자·작업자 배정 드롭다운에서 활성 사용자만 role별로 조회 */
    List<User> findByRoleAndIsActiveTrue(User.Role role);
}
