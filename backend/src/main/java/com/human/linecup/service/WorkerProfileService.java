package com.human.linecup.service;

import com.human.linecup.dto.request.WorkerProfileRequest;
import com.human.linecup.dto.request.WorkerSkillRequest;
import com.human.linecup.dto.response.WorkerProfileResponse;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.entity.User;
import com.human.linecup.entity.UserRole;
import com.human.linecup.entity.WorkerProfile;
import com.human.linecup.entity.WorkerSkill;
import com.human.linecup.repository.ManufacturingProcessRepository;
import com.human.linecup.repository.UserRepository;
import com.human.linecup.repository.WorkerProfileRepository;
import com.human.linecup.repository.WorkerSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkerProfileService {

    private final WorkerProfileRepository workerProfileRepository;
    private final WorkerSkillRepository workerSkillRepository;
    private final UserRepository userRepository;
    private final ManufacturingProcessRepository manufacturingProcessRepository;

    @Transactional
    public WorkerProfileResponse create(WorkerProfileRequest request) {
        if (workerProfileRepository.existsByUserUserId(request.userId())) {
            throw new IllegalArgumentException("이미 작업자 프로필이 등록된 사용자입니다.");
        }
        User user = findOperator(request.userId());
        ManufacturingProcess process = findProcess(request.primaryProcessId());
        WorkerProfile profile = WorkerProfile.create(
                user,
                request.teamName(),
                request.shiftType(),
                request.joinedDate(),
                process
        );
        return toResponse(workerProfileRepository.save(profile), List.of());
    }

    @Transactional
    public WorkerProfileResponse update(Long workerProfileId, WorkerProfileRequest request) {
        WorkerProfile profile = findProfile(workerProfileId);
        if (!profile.getUser().getUserId().equals(request.userId())) {
            throw new IllegalArgumentException("작업자 프로필의 사용자는 변경할 수 없습니다.");
        }
        profile.change(
                request.teamName(),
                request.shiftType(),
                request.joinedDate(),
                findProcess(request.primaryProcessId())
        );
        return toResponse(profile, findSkills(workerProfileId));
    }

    public WorkerProfileResponse get(Long workerProfileId) {
        WorkerProfile profile = findProfile(workerProfileId);
        return toResponse(profile, findSkills(workerProfileId));
    }

    public WorkerProfileResponse getByUser(Long userId) {
        WorkerProfile profile = workerProfileRepository.findByUserUserId(userId)
                .orElseThrow(() -> new NoSuchElementException(
                        "사용자의 작업자 프로필을 찾을 수 없습니다: " + userId
                ));
        return toResponse(profile, findSkills(profile.getWorkerProfileId()));
    }

    public Page<WorkerProfileResponse> search(String keyword, Pageable pageable) {
        Page<WorkerProfile> page = workerProfileRepository.search(normalizeKeyword(keyword), pageable);
        List<Long> profileIds = page.getContent().stream()
                .map(WorkerProfile::getWorkerProfileId)
                .toList();
        Map<Long, List<WorkerSkill>> skillsByProfileId = profileIds.isEmpty()
                ? Map.of()
                : workerSkillRepository.findByWorkerProfileIds(profileIds).stream()
                        .collect(Collectors.groupingBy(
                                skill -> skill.getWorkerProfile().getWorkerProfileId()
                        ));
        return page.map(profile -> toResponse(
                profile,
                skillsByProfileId.getOrDefault(profile.getWorkerProfileId(), List.of())
        ));
    }

    @Transactional
    public WorkerProfileResponse addSkill(Long workerProfileId, WorkerSkillRequest request) {
        WorkerProfile profile = findProfile(workerProfileId);
        String skillName = requireText(request.skillName(), "기능명");
        if (workerSkillRepository.existsByWorkerProfileWorkerProfileIdAndSkillNameIgnoreCase(
                workerProfileId,
                skillName
        )) {
            throw new IllegalArgumentException("이미 등록된 기능입니다: " + skillName);
        }
        workerSkillRepository.save(WorkerSkill.create(profile, skillName));
        return toResponse(profile, findSkills(workerProfileId));
    }

    @Transactional
    public WorkerProfileResponse removeSkill(Long workerProfileId, String skillName) {
        WorkerProfile profile = findProfile(workerProfileId);
        String normalized = requireText(skillName, "기능명");
        WorkerSkill skill = findSkills(workerProfileId).stream()
                .filter(item -> item.getSkillName().equalsIgnoreCase(normalized))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("등록되지 않은 기능입니다: " + normalized));
        workerSkillRepository.delete(skill);
        return toResponse(
                profile,
                findSkills(workerProfileId).stream()
                        .filter(item -> !item.getWorkerSkillId().equals(skill.getWorkerSkillId()))
                        .toList()
        );
    }

    @Transactional
    public void delete(Long workerProfileId) {
        WorkerProfile profile = findProfile(workerProfileId);
        workerSkillRepository.deleteByWorkerProfileWorkerProfileId(workerProfileId);
        workerProfileRepository.delete(profile);
    }

    private User findOperator(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다: " + userId));
        if (user.getRole() != UserRole.OPERATOR) {
            throw new IllegalArgumentException("작업자 역할의 사용자만 작업자 프로필을 등록할 수 있습니다.");
        }
        return user;
    }

    private ManufacturingProcess findProcess(Long processId) {
        return manufacturingProcessRepository.findById(processId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 공정입니다: " + processId));
    }

    private WorkerProfile findProfile(Long workerProfileId) {
        return workerProfileRepository.findById(workerProfileId)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 작업자 프로필입니다: " + workerProfileId
                ));
    }

    private List<WorkerSkill> findSkills(Long workerProfileId) {
        return workerSkillRepository
                .findByWorkerProfileWorkerProfileIdOrderBySkillNameAsc(workerProfileId);
    }

    private WorkerProfileResponse toResponse(WorkerProfile profile, List<WorkerSkill> skills) {
        User user = profile.getUser();
        ManufacturingProcess process = profile.getPrimaryProcess();
        return new WorkerProfileResponse(
                profile.getWorkerProfileId(),
                user.getUserId(),
                user.getEmpNo(),
                user.getName(),
                profile.getTeamName(),
                profile.getShiftType(),
                profile.getShiftType().getLabel(),
                profile.getJoinedDate(),
                process.getProcessId(),
                process.getProcessCode(),
                process.getProcessName(),
                skills.stream().map(WorkerSkill::getSkillName).toList()
        );
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? null : keyword.trim();
    }

    private String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }
}
