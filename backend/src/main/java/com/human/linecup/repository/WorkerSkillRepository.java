package com.human.linecup.repository;

import com.human.linecup.entity.WorkerSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface WorkerSkillRepository extends JpaRepository<WorkerSkill, Long> {

    List<WorkerSkill> findByWorkerProfileWorkerProfileIdOrderBySkillNameAsc(Long workerProfileId);

    @Query("""
            select ws
            from WorkerSkill ws
            where ws.workerProfile.workerProfileId in :workerProfileIds
            order by ws.workerProfile.workerProfileId, ws.skillName
            """)
    List<WorkerSkill> findByWorkerProfileIds(
            @Param("workerProfileIds") Collection<Long> workerProfileIds
    );

    boolean existsByWorkerProfileWorkerProfileIdAndSkillNameIgnoreCase(
            Long workerProfileId,
            String skillName
    );

    long deleteByWorkerProfileWorkerProfileId(Long workerProfileId);
}
