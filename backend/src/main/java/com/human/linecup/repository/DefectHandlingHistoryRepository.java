package com.human.linecup.repository;

import com.human.linecup.entity.DefectHandlingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DefectHandlingHistoryRepository
        extends JpaRepository<DefectHandlingHistory, Long> {

    List<DefectHandlingHistory> findByDefect_DefectIdOrderByHandledAtAscDefectHandlingHistoryIdAsc(
            Long defectId
    );
}
