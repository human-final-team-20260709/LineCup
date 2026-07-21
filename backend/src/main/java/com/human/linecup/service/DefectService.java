package com.human.linecup.service;

import com.human.linecup.dto.request.DefectCreateRequest;
import com.human.linecup.dto.request.DefectUpdateRequest;
import com.human.linecup.dto.response.*;
import com.human.linecup.entity.Defect;
import com.human.linecup.entity.DefectHistory;
import com.human.linecup.repository.DefectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefectService {

    private static final DateTimeFormatter ID_DATE_FORMAT = DateTimeFormatter.ofPattern("yyMMdd");

    private final DefectRepository defectRepository;

    public Page<DefectListItemResponse> search(String keyword, String status, Long equipmentId, Pageable pageable) {
        return defectRepository
                .search(blankToNull(keyword), blankToNull(status), equipmentId, pageable)
                .map(DefectListItemResponse::from);
    }

    public DefectDetailResponse getDetail(Long id) {
        return DefectDetailResponse.from(getDefectOrThrow(id));
    }

    @Transactional
    public DefectDetailResponse create(DefectCreateRequest request) {
        LocalDateTime now = LocalDateTime.now();
        String status = request.getStatus() == null || request.getStatus().isBlank()
                ? Defect.STATUS_UNHANDLED : request.getStatus();

        Defect defect = Defect.builder()
                .defectNo(generateDefectNo(now))
                .occurredAt(now)
                .productionLotId(request.getProductionLotId())
                .equipmentId(request.getEquipmentId())
                .handlerId(request.getHandlerId())
                .defectType(request.getDefectType())
                .quantity(request.getQuantity())
                .cause(request.getCause())
                .handleMethod(request.getHandleMethod())
                .status(status)
                .build();

        defect.addHistory(DefectHistory.builder()
                .occurredAt(now)
                .title("불량 등록")
                .description("%s %d EA 확인 (설비 ID %d)".formatted(defect.getDefectType(), defect.getQuantity(), defect.getEquipmentId()))
                .tone("alarm")
                .build());

        return DefectDetailResponse.from(defectRepository.save(defect));
    }

    @Transactional
    public DefectDetailResponse updateTreatment(Long id, DefectUpdateRequest request) {
        Defect defect = getDefectOrThrow(id);
        defect.updateTreatment(request.getHandleMethod(), request.getHandlerId(), request.getStatus());

        defect.addHistory(DefectHistory.builder()
                .occurredAt(LocalDateTime.now())
                .title("처리 정보 갱신")
                .description(request.getNote() == null || request.getNote().isBlank()
                        ? "처리 방법 %s, 상태 %s로 변경".formatted(request.getHandleMethod(), request.getStatus())
                        : request.getNote())
                .tone("primary")
                .build());

        return DefectDetailResponse.from(defect);
    }

    public DefectDashboardResponse getDashboard() {
        List<DefectRepository.EquipmentQuantity> byEquipment = defectRepository.sumQuantityByEquipment();
        long max = byEquipment.stream().mapToLong(DefectRepository.EquipmentQuantity::getTotal).max().orElse(0);

        List<DefectDashboardResponse.EquipmentDefectCount> equipmentDefects = byEquipment.stream()
                .map(row -> DefectDashboardResponse.EquipmentDefectCount.builder()
                        .equipmentId(row.getEquipmentId())
                        .quantity(row.getTotal())
                        .ratio(max == 0 ? 0 : (int) Math.round(row.getTotal() * 100.0 / max))
                        .build())
                .toList();

        List<DefectListItemResponse> recentDefects = defectRepository.findTop10ByOrderByOccurredAtDesc().stream()
                .map(DefectListItemResponse::from)
                .toList();

        return DefectDashboardResponse.builder()
                .equipmentDefects(equipmentDefects)
                .recentDefects(recentDefects)
                .build();
    }

    public DefectStatisticsResponse getStatistics() {
        List<DefectStatisticsResponse.DailyCount> dailyCounts = defectRepository.countByDate().stream()
                .map(row -> DefectStatisticsResponse.DailyCount.builder()
                        .date(row.getLabel())
                        .count(row.getTotal())
                        .build())
                .toList();

        List<DefectStatisticsResponse.EquipmentCount> equipmentCounts = defectRepository.sumQuantityByEquipment().stream()
                .map(row -> DefectStatisticsResponse.EquipmentCount.builder()
                        .equipmentId(row.getEquipmentId())
                        .count(row.getTotal())
                        .build())
                .toList();

        List<DefectRepository.GroupCount> typeRows = defectRepository.countByType();
        long typeTotal = typeRows.stream().mapToLong(DefectRepository.GroupCount::getTotal).sum();
        List<DefectStatisticsResponse.TypeCount> typeCounts = typeRows.stream()
                .map(row -> DefectStatisticsResponse.TypeCount.builder()
                        .type(row.getLabel())
                        .count(row.getTotal())
                        .percent(typeTotal == 0 ? 0 : (int) Math.round(row.getTotal() * 100.0 / typeTotal))
                        .build())
                .toList();

        AtomicInteger rank = new AtomicInteger(1);
        List<DefectStatisticsResponse.RankingItem> ranking = defectRepository.countByTypeAndEquipment().stream()
                .limit(5)
                .map(row -> DefectStatisticsResponse.RankingItem.builder()
                        .rank(rank.getAndIncrement())
                        .type(row.getType())
                        .equipmentId(row.getEquipmentId())
                        .count(row.getTotal())
                        .build())
                .toList();

        return DefectStatisticsResponse.builder()
                .dailyCounts(dailyCounts)
                .equipmentCounts(equipmentCounts)
                .typeCounts(typeCounts)
                .ranking(ranking)
                .build();
    }

    private Defect getDefectOrThrow(Long id) {
        return defectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 불량 이력입니다: " + id));
    }

    private String generateDefectNo(LocalDateTime now) {
        String prefix = "DF-" + now.format(ID_DATE_FORMAT) + "-";
        long todayCount = defectRepository.count() + 1;
        return prefix + "%03d".formatted(todayCount);
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank() || "all".equalsIgnoreCase(value)) ? null : value;
    }
}