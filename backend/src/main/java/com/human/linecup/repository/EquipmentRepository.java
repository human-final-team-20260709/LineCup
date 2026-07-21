package com.human.linecup.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.human.linecup.entity.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
}
