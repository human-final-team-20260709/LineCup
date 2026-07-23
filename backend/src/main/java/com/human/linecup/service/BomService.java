package com.human.linecup.service;

import com.human.linecup.dto.request.BomRequest;
import com.human.linecup.dto.request.BomRequest.BomItemRequest;
import com.human.linecup.dto.response.BomItemResponse;
import com.human.linecup.dto.response.BomResponse;
import com.human.linecup.entity.Bom;
import com.human.linecup.entity.BusinessConflictException;
import com.human.linecup.entity.Bom.BomStatus;
import com.human.linecup.entity.BomItem;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.RawMaterial;
import com.human.linecup.repository.BomItemRepository;
import com.human.linecup.repository.BomRepository;
import com.human.linecup.repository.ManufacturingProcessRepository;
import com.human.linecup.repository.ProductRepository;
import com.human.linecup.repository.RawMaterialRepository;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BomService {

    private final BomRepository bomRepository;
    private final BomItemRepository bomItemRepository;
    private final ProductRepository productRepository;
    private final RawMaterialRepository rawMaterialRepository;
    private final ManufacturingProcessRepository manufacturingProcessRepository;

    @Transactional
    public BomResponse createBom(BomRequest request) {
        validateDuplicateKeys(request, null);
        validateUniqueMaterials(request.items());

        Product product = findProduct(request.productId());
        Bom bom = Bom.create(
                request.bomCode(),
                request.version(),
                product,
                request.status(),
                request.note()
        );
        bomRepository.save(bom);

        List<BomItem> items = createItems(bom, request.items());
        bomItemRepository.saveAll(items);
        return toResponse(bom, items);
    }

    public BomResponse getBom(Long bomId) {
        Bom bom = findBom(bomId);
        return toResponse(bom, bomItemRepository.findByBomBomIdOrderByBomItemIdAsc(bomId));
    }

    public BomResponse getBomByCode(String bomCode) {
        Bom bom = bomRepository.findByBomCode(bomCode)
                .orElseThrow(() -> new NoSuchElementException("BOM을 찾을 수 없습니다: " + bomCode));
        return toResponse(
                bom,
                bomItemRepository.findByBomBomIdOrderByBomItemIdAsc(bom.getBomId())
        );
    }

    public List<BomResponse> getBomsByProduct(Long productId) {
        List<Bom> boms = bomRepository.findByProductProductIdOrderByBomIdDesc(productId);
        return mapBoms(boms);
    }

    public Page<BomResponse> searchBoms(
            String keyword,
            BomStatus status,
            Pageable pageable
    ) {
        Page<Bom> page = bomRepository.search(normalizeKeyword(keyword), status, pageable);
        Map<Long, List<BomItem>> itemsByBomId = getItemsByBomId(page.getContent());
        return page.map(bom -> toResponse(
                bom,
                itemsByBomId.getOrDefault(bom.getBomId(), List.of())
        ));
    }

    @Transactional
    public BomResponse updateBom(Long bomId, BomRequest request) {
        Bom bom = findBom(bomId);
        validateImmutableHeader(bom, request);
        validateUniqueMaterials(request.items());
        bom.change(request.status(), request.note());

        // BOM 코드, 버전, 제품은 버전 식별값이므로 유지하고 항목만 교체한다.
        bomItemRepository.deleteByBomBomId(bomId);
        bomItemRepository.flush();
        List<BomItem> items = createItems(bom, request.items());
        bomItemRepository.saveAll(items);
        return toResponse(bom, items);
    }

    @Transactional
    public void deleteBom(Long bomId) {
        Bom bom = findBom(bomId);
        bomItemRepository.deleteByBomBomId(bomId);
        bomRepository.delete(bom);
    }

    private void validateDuplicateKeys(BomRequest request, Long currentBomId) {
        bomRepository.findByBomCode(request.bomCode())
                .filter(found -> !found.getBomId().equals(currentBomId))
                .ifPresent(found -> {
                    throw new BusinessConflictException("이미 사용 중인 BOM 코드입니다: " + request.bomCode());
                });
        bomRepository.findByProductProductIdAndVersion(request.productId(), request.version())
                .filter(found -> !found.getBomId().equals(currentBomId))
                .ifPresent(found -> {
                    throw new BusinessConflictException("해당 제품에 이미 같은 BOM 버전이 있습니다.");
                });
    }

    private void validateImmutableHeader(Bom bom, BomRequest request) {
        if (!bom.getBomCode().equals(request.bomCode())
                || !bom.getVersion().equals(request.version())
                || !bom.getProduct().getProductId().equals(request.productId())) {
            throw new IllegalArgumentException("BOM 코드, 버전, 제품은 수정할 수 없습니다. 새 BOM 버전을 등록하세요.");
        }
    }

    private void validateUniqueMaterials(List<BomItemRequest> itemRequests) {
        if (itemRequests.isEmpty()) {
            throw new IllegalArgumentException("BOM에는 하나 이상의 원자재 항목이 필요합니다.");
        }
        Set<Long> materialIds = new HashSet<>();
        for (BomItemRequest item : itemRequests) {
            if (!materialIds.add(item.materialId())) {
                throw new IllegalArgumentException("한 BOM에 같은 원자재를 중복 등록할 수 없습니다.");
            }
        }
    }

    private List<BomItem> createItems(Bom bom, List<BomItemRequest> requests) {
        Set<Long> materialIds = requests.stream()
                .map(BomItemRequest::materialId)
                .collect(Collectors.toSet());
        Set<Long> processIds = requests.stream()
                .map(BomItemRequest::processId)
                .collect(Collectors.toSet());

        Map<Long, RawMaterial> materials = rawMaterialRepository.findAllById(materialIds).stream()
                .collect(Collectors.toMap(RawMaterial::getMaterialId, Function.identity()));
        Map<Long, ManufacturingProcess> processes = manufacturingProcessRepository.findAllById(processIds).stream()
                .collect(Collectors.toMap(ManufacturingProcess::getProcessId, Function.identity()));

        if (materials.size() != materialIds.size()) {
            throw new NoSuchElementException("존재하지 않는 원자재가 BOM 항목에 포함되어 있습니다.");
        }
        if (processes.size() != processIds.size()) {
            throw new NoSuchElementException("존재하지 않는 공정이 BOM 항목에 포함되어 있습니다.");
        }

        return requests.stream()
                .map(item -> BomItem.create(
                        bom,
                        materials.get(item.materialId()),
                        processes.get(item.processId()),
                        item.spec(),
                        item.requiredQty(),
                        item.lossRate(),
                        item.note()
                ))
                .toList();
    }

    private List<BomResponse> mapBoms(List<Bom> boms) {
        Map<Long, List<BomItem>> itemsByBomId = getItemsByBomId(boms);
        return boms.stream()
                .map(bom -> toResponse(
                        bom,
                        itemsByBomId.getOrDefault(bom.getBomId(), List.of())
                ))
                .toList();
    }

    private Map<Long, List<BomItem>> getItemsByBomId(List<Bom> boms) {
        if (boms.isEmpty()) {
            return Map.of();
        }
        List<Long> bomIds = boms.stream().map(Bom::getBomId).toList();
        return bomItemRepository.findByBomIds(bomIds).stream()
                .collect(Collectors.groupingBy(item -> item.getBom().getBomId()));
    }

    private BomResponse toResponse(Bom bom, List<BomItem> items) {
        Product product = bom.getProduct();
        return new BomResponse(
                bom.getBomId(),
                bom.getBomCode(),
                bom.getVersion(),
                product.getProductId(),
                product.getProductCode(),
                product.getProductName(),
                bom.getStatus(),
                bom.getStatus().getLabel(),
                bom.getNote(),
                items.stream().map(this::toItemResponse).toList()
        );
    }

    private BomItemResponse toItemResponse(BomItem item) {
        RawMaterial material = item.getRawMaterial();
        ManufacturingProcess process = item.getManufacturingProcess();
        return new BomItemResponse(
                item.getBomItemId(),
                material.getMaterialId(),
                material.getMaterialCode(),
                material.getMaterialName(),
                material.getStatus(),
                material.getStatus().getLabel(),
                process.getProcessId(),
                process.getProcessCode(),
                process.getProcessName(),
                item.getSpec(),
                item.getRequiredQty(),
                item.getLossRate(),
                material.getUnit(),
                item.getNote()
        );
    }

    private Bom findBom(Long bomId) {
        return bomRepository.findById(bomId)
                .orElseThrow(() -> new NoSuchElementException("BOM을 찾을 수 없습니다: " + bomId));
    }

    private Product findProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("제품을 찾을 수 없습니다: " + productId));
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? null : keyword.trim();
    }
}
