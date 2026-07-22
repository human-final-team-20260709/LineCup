package com.human.linecup.service;

import com.human.linecup.dto.request.RawMaterialRequest;
import com.human.linecup.dto.response.RawMaterialResponse;
import com.human.linecup.entity.RawMaterial;
import com.human.linecup.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RawMaterialService {

    private final RawMaterialRepository rawMaterialRepository;

    @Transactional
    public RawMaterialResponse create(RawMaterialRequest request) {
        validateUniqueCode(request.materialCode(), null);
        RawMaterial material = RawMaterial.create(
                request.materialCode(),
                request.materialName(),
                request.unit(),
                request.safetyStockQty(),
                request.status()
        );
        return toResponse(rawMaterialRepository.save(material));
    }

    @Transactional
    public RawMaterialResponse update(Long materialId, RawMaterialRequest request) {
        RawMaterial material = findMaterial(materialId);
        validateUniqueCode(request.materialCode(), materialId);
        material.changeInfo(
                request.materialCode(),
                request.materialName(),
                request.unit(),
                request.safetyStockQty(),
                request.status()
        );
        return toResponse(material);
    }

    public RawMaterialResponse get(Long materialId) {
        return toResponse(findMaterial(materialId));
    }

    public List<RawMaterialResponse> getAll() {
        return rawMaterialRepository.findAllByOrderByMaterialNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<RawMaterialResponse> search(
            String keyword,
            RawMaterial.RawMaterialStatus status,
            Pageable pageable
    ) {
        return rawMaterialRepository.search(normalizeKeyword(keyword), status, pageable)
                .map(this::toResponse);
    }

    private RawMaterial findMaterial(Long materialId) {
        return rawMaterialRepository.findById(materialId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 원자재입니다: " + materialId));
    }

    private void validateUniqueCode(String materialCode, Long currentMaterialId) {
        rawMaterialRepository.findByMaterialCode(materialCode)
                .filter(material -> !material.getMaterialId().equals(currentMaterialId))
                .ifPresent(material -> {
                    throw new IllegalArgumentException("이미 사용 중인 원자재 코드입니다: " + materialCode);
                });
    }

    private RawMaterialResponse toResponse(RawMaterial material) {
        return new RawMaterialResponse(
                material.getMaterialId(),
                material.getMaterialCode(),
                material.getMaterialName(),
                material.getUnit(),
                material.getSafetyStockQty(),
                material.getStatus(),
                material.getStatus().getLabel()
        );
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? null : keyword.trim();
    }
}
