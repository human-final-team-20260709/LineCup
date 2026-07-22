package com.human.linecup.service;

import com.human.linecup.dto.request.AlarmCreateRequest;
import com.human.linecup.dto.request.AlarmHandlingRequest;
import com.human.linecup.dto.request.AlarmSearchRequest;
import com.human.linecup.dto.response.AlarmDetailResponse;
import com.human.linecup.dto.response.AlarmSummaryResponse;
import com.human.linecup.entity.Alarm;
import com.human.linecup.entity.AlarmStatus;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.entity.User;
import com.human.linecup.repository.AlarmRepository;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
public class AlarmService {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Seoul");
    private static final DateTimeFormatter NUMBER_DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyMMdd").withZone(BUSINESS_ZONE);
    private static final Sort DEFAULT_SORT = Sort.by(
            Sort.Order.desc("occurredAt"),
            Sort.Order.desc("alarmId")
    );
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_NUMBER_LOOKUPS = 1_000;

    private final AlarmRepository alarmRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;
    private final Clock clock;

    @Autowired
    public AlarmService(
            AlarmRepository alarmRepository,
            EquipmentRepository equipmentRepository,
            UserRepository userRepository
    ) {
        this(alarmRepository, equipmentRepository, userRepository, Clock.systemUTC());
    }

    public AlarmService(
            AlarmRepository alarmRepository,
            EquipmentRepository equipmentRepository,
            UserRepository userRepository,
            Clock clock
    ) {
        this.alarmRepository = Objects.requireNonNull(alarmRepository, "알람 저장소는 필수입니다.");
        this.equipmentRepository = Objects.requireNonNull(equipmentRepository, "설비 저장소는 필수입니다.");
        this.userRepository = Objects.requireNonNull(userRepository, "사용자 저장소는 필수입니다.");
        this.clock = Objects.requireNonNull(clock, "Clock은 필수입니다.");
    }

    @Transactional
    public AlarmDetailResponse createAlarm(AlarmCreateRequest request) {
        Objects.requireNonNull(request, "알람 등록 요청은 필수입니다.");

        Instant now = clock.instant();
        Instant occurredAt = request.occurredAt() == null ? now : request.occurredAt();
        if (occurredAt.isAfter(now)) {
            throw new IllegalArgumentException("알람 발생 시각은 현재 시각 이후일 수 없습니다.");
        }

        Equipment equipment = findEquipment(request.equipmentId());
        Alarm alarm = Alarm.create(
                generateAlarmNo(occurredAt),
                equipment,
                request.message(),
                request.description(),
                request.severity(),
                occurredAt
        );

        return toDetail(alarmRepository.save(alarm));
    }

    public Page<AlarmSummaryResponse> getAlarms(
            AlarmSearchRequest request,
            Pageable pageable
    ) {
        AlarmSearchRequest condition = request == null ? AlarmSearchRequest.empty() : request;
        validatePeriod(condition.startAt(), condition.endAt());
        if (condition.equipmentId() != null) {
            requirePositiveId(condition.equipmentId(), "설비 ID");
        }

        return alarmRepository.findAll(
                        createSearchSpecification(condition),
                        withDefaultSort(pageable)
                )
                .map(this::toSummary);
    }

    public Page<AlarmSummaryResponse> getCurrentAlarms(Pageable pageable) {
        return alarmRepository.findByStatusNotOrderByOccurredAtDescAlarmIdDesc(
                        AlarmStatus.RESOLVED,
                        pageableOrDefault(pageable)
                )
                .map(this::toSummary);
    }

    public AlarmDetailResponse getAlarm(Long alarmId) {
        return toDetail(findAlarm(alarmId));
    }

    public AlarmDetailResponse getAlarmByNo(String alarmNo) {
        String normalizedAlarmNo = requireText(alarmNo, "알람 번호");
        Alarm alarm = alarmRepository.findByAlarmNo(normalizedAlarmNo)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 알람입니다: " + normalizedAlarmNo
                ));
        return toDetail(alarm);
    }

    public Page<AlarmSummaryResponse> getAlarmsByPeriod(
            Instant startAt,
            Instant endAt,
            Pageable pageable
    ) {
        if (startAt == null || endAt == null) {
            throw new IllegalArgumentException("조회 시작 시각과 종료 시각은 필수입니다.");
        }
        validatePeriod(startAt, endAt);

        return alarmRepository.findByOccurredAtBetweenOrderByOccurredAtDescAlarmIdDesc(
                        startAt,
                        endAt,
                        pageableOrDefault(pageable)
                )
                .map(this::toSummary);
    }

    @Transactional
    public AlarmDetailResponse updateHandling(Long alarmId, AlarmHandlingRequest request) {
        Objects.requireNonNull(request, "알람 처리 요청은 필수입니다.");

        Alarm alarm = findAlarm(alarmId);
        AlarmStatus nextStatus = Objects.requireNonNull(
                request.status(),
                "알람 상태는 필수입니다."
        );

        validateHandlingTransition(alarm, request, nextStatus);

        User handler = request.handlerId() == null
                ? null
                : findUser(request.handlerId(), "처리자");
        Instant resolvedAt = resolveEffectiveResolvedAt(alarm, request, nextStatus);

        alarm.updateHandling(
                handler,
                request.handlingContent(),
                nextStatus,
                resolvedAt
        );
        return toDetail(alarm);
    }

    private Specification<Alarm> createSearchSpecification(AlarmSearchRequest condition) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Alarm, Equipment> equipment = root.join("equipment", JoinType.INNER);

            if (condition.equipmentId() != null) {
                predicates.add(criteriaBuilder.equal(
                        equipment.get("equipmentId"),
                        condition.equipmentId()
                ));
            }
            if (condition.severity() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("severity"),
                        condition.severity()
                ));
            }
            if (condition.status() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("status"),
                        condition.status()
                ));
            }
            if (condition.handled() != null) {
                Predicate resolvedStatus = criteriaBuilder.equal(
                        root.get("status"),
                        AlarmStatus.RESOLVED
                );
                Predicate hasResolvedAt = criteriaBuilder.isNotNull(root.get("resolvedAt"));
                if (condition.handled()) {
                    predicates.add(criteriaBuilder.and(resolvedStatus, hasResolvedAt));
                } else {
                    predicates.add(criteriaBuilder.or(
                            criteriaBuilder.notEqual(root.get("status"), AlarmStatus.RESOLVED),
                            criteriaBuilder.isNull(root.get("resolvedAt"))
                    ));
                }
            }
            if (condition.startAt() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("occurredAt"),
                        condition.startAt()
                ));
            }
            if (condition.endAt() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("occurredAt"),
                        condition.endAt()
                ));
            }

            String keyword = normalizeText(condition.keyword());
            if (keyword != null) {
                String pattern = toContainsPattern(keyword);
                Join<Equipment, ManufacturingProcess> process =
                        equipment.join("manufacturingProcess", JoinType.INNER);
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("alarmNo")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("message")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(equipment.get("equipmentCode")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(equipment.get("equipmentName")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(equipment.get("location")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(process.get("processName")), pattern, '\\')
                ));
            }

            return predicates.isEmpty()
                    ? criteriaBuilder.conjunction()
                    : criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private void validateHandlingTransition(
            Alarm alarm,
            AlarmHandlingRequest request,
            AlarmStatus nextStatus
    ) {
        if (alarm.getStatus() == AlarmStatus.RESOLVED && nextStatus != AlarmStatus.RESOLVED) {
            throw new IllegalStateException("처리 완료된 알람은 다시 미처리 상태로 열 수 없습니다.");
        }

        if (nextStatus == AlarmStatus.PENDING_CONFIRMATION
                && (request.handlerId() != null
                || normalizeText(request.handlingContent()) != null
                || request.resolvedAt() != null)) {
            throw new IllegalArgumentException("확인 대기 상태에는 처리 정보를 등록할 수 없습니다.");
        }

        if (nextStatus == AlarmStatus.RESOLVED) {
            requirePositiveId(request.handlerId(), "처리자 ID");
            requireText(request.handlingContent(), "조치 내용");
        } else if (request.resolvedAt() != null) {
            throw new IllegalArgumentException("처리 완료가 아닌 상태에는 해제 시각을 지정할 수 없습니다.");
        }
    }

    private Instant resolveEffectiveResolvedAt(
            Alarm alarm,
            AlarmHandlingRequest request,
            AlarmStatus nextStatus
    ) {
        if (nextStatus != AlarmStatus.RESOLVED) {
            return null;
        }

        Instant resolvedAt = request.resolvedAt();
        if (resolvedAt == null && alarm.getStatus() == AlarmStatus.RESOLVED) {
            resolvedAt = alarm.getResolvedAt();
        }
        if (resolvedAt == null) {
            resolvedAt = clock.instant();
        }
        if (resolvedAt.isBefore(alarm.getOccurredAt())) {
            throw new IllegalArgumentException("알람 해제 시각은 발생 시각 이후여야 합니다.");
        }
        if (resolvedAt.isAfter(clock.instant())) {
            throw new IllegalArgumentException("알람 해제 시각은 현재 시각 이후일 수 없습니다.");
        }
        return resolvedAt;
    }

    private Alarm findAlarm(Long alarmId) {
        requirePositiveId(alarmId, "알람 ID");
        return alarmRepository.findById(alarmId)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 알람입니다: " + alarmId
                ));
    }

    private Equipment findEquipment(Long equipmentId) {
        requirePositiveId(equipmentId, "설비 ID");
        return equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 설비입니다: " + equipmentId
                ));
    }

    private User findUser(Long userId, String roleName) {
        requirePositiveId(userId, roleName + " ID");
        return userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 " + roleName + "입니다: " + userId
                ));
    }

    private String generateAlarmNo(Instant occurredAt) {
        String prefix = "ALM-" + NUMBER_DATE_FORMAT.format(occurredAt) + "-";
        long sequence = alarmRepository.count() + 1L;

        for (int attempt = 0; attempt < MAX_NUMBER_LOOKUPS; attempt++, sequence++) {
            String candidate = prefix + String.format(Locale.ROOT, "%03d", sequence);
            if (alarmRepository.findByAlarmNo(candidate).isEmpty()) {
                return candidate;
            }
        }
        throw new IllegalStateException("사용 가능한 알람 번호를 생성할 수 없습니다.");
    }

    private AlarmSummaryResponse toSummary(Alarm alarm) {
        Equipment equipment = alarm.getEquipment();
        ManufacturingProcess process = equipment.getManufacturingProcess();

        return new AlarmSummaryResponse(
                alarm.getAlarmId(),
                alarm.getAlarmNo(),
                equipment.getEquipmentId(),
                equipment.getEquipmentCode(),
                equipment.getEquipmentName(),
                process.getProcessName(),
                equipment.getLocation(),
                alarm.getMessage(),
                alarm.getSeverity(),
                alarm.getSeverity().getLabel(),
                alarm.getStatus(),
                alarm.getStatus().getLabel(),
                alarm.getOccurredAt(),
                alarm.getResolvedAt(),
                alarm.isHandled()
        );
    }

    private AlarmDetailResponse toDetail(Alarm alarm) {
        User handler = alarm.getHandler();
        return new AlarmDetailResponse(
                toSummary(alarm),
                alarm.getDescription(),
                handler == null ? null : handler.getUserId(),
                handler == null ? null : handler.getEmpNo(),
                handler == null ? null : handler.getName(),
                alarm.getHandlingContent(),
                alarm.getResolvedAt()
        );
    }

    private Pageable withDefaultSort(Pageable pageable) {
        Pageable effective = pageableOrDefault(pageable);
        if (effective.getSort().isSorted()) {
            return effective;
        }
        return PageRequest.of(
                effective.getPageNumber(),
                effective.getPageSize(),
                DEFAULT_SORT
        );
    }

    private Pageable pageableOrDefault(Pageable pageable) {
        if (pageable == null || pageable.isUnpaged()) {
            return PageRequest.of(0, DEFAULT_PAGE_SIZE);
        }
        return pageable;
    }

    private void validatePeriod(Instant startAt, Instant endAt) {
        if (startAt != null && endAt != null && startAt.isAfter(endAt)) {
            throw new IllegalArgumentException("조회 시작 시각은 종료 시각보다 늦을 수 없습니다.");
        }
    }

    private static void requirePositiveId(Long id, String fieldName) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException(fieldName + "는 양수여야 합니다.");
        }
    }

    private static String requireText(String value, String fieldName) {
        String normalized = normalizeText(value);
        if (normalized == null) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return normalized;
    }

    private static String normalizeText(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private static String toContainsPattern(String keyword) {
        String escaped = keyword.toLowerCase(Locale.ROOT)
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
        return "%" + escaped + "%";
    }
}
