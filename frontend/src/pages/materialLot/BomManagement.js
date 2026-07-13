import { useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiChevronRight,
  FiEdit3,
  FiRefreshCcw,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import {
  Badge,
  BomContentGrid,
  BomTable,
  EmptyState,
  FilterButton,
  HeaderActions,
  HeaderMeta,
  MaterialSummary,
  ModalActions,
  ModalBackdrop,
  ModalBody,
  ModalButton,
  ModalCloseButton,
  ModalField,
  ModalGrid,
  ModalHeader,
  ModalNotice,
  ModalInput,
  ModalPanel,
  ModalSection,
  ModalSectionDescription,
  ModalSectionHeader,
  ModalSectionTitle,
  ModalSelect,
  ModalTextarea,
  ModalTitle,
  AddRowButton,
  MaterialInputTable,
  MaterialTableActions,
  MaterialTableWrap,
  PageSection,
  Panel,
  PanelBody,
  PanelHeader,
  PanelTitle,
  ProductCode,
  ProductItem,
  ProductList,
  ProductMeta,
  ProductName,
  ProductEditButton,
  SearchBox,
  SectionCaption,
  SummaryCard,
  SummaryLabel,
  SummaryValue,
  TableInput,
  TableRowActionButton,
  TableSelect,
  TableWrap,
  Toolbar,
  ResetRowsButton,
} from "./BomManagementCss";

const products = [
  {
    code: "FG-CUP-110-RD",
    name: "매운 컵라면 110g",
    category: "컵라면",
    unit: "EA",
    bomVersion: "BOM-V3.2",
    status: "사용중",
    materials: [
      {
        code: "RM-NDL-001",
        name: "면 블록",
        spec: "원형 92mm",
        required: "1.000",
        unit: "EA",
        loss: "0.5%",
        status: "정상",
      },
      {
        code: "RM-SUP-014",
        name: "분말 스프",
        spec: "매운맛",
        required: "12.500",
        unit: "g",
        loss: "1.0%",
        status: "부족",
      },
      {
        code: "RM-VEG-006",
        name: "건더기",
        spec: "건조야채 믹스",
        required: "2.200",
        unit: "g",
        loss: "0.8%",
        status: "정상",
      },
      {
        code: "PK-CUP-110",
        name: "컵 용기",
        spec: "110g 전용",
        required: "1.000",
        unit: "EA",
        loss: "0.3%",
        status: "주의",
      },
      {
        code: "PK-LID-110",
        name: "뚜껑 필름",
        spec: "알루미늄 라미",
        required: "1.000",
        unit: "EA",
        loss: "0.3%",
        status: "정상",
      },
    ],
  },
  {
    code: "FG-CUP-105-SEA",
    name: "해물 컵라면 105g",
    category: "컵라면",
    unit: "EA",
    bomVersion: "BOM-V2.8",
    status: "검토",
    materials: [
      {
        code: "RM-NDL-002",
        name: "면 블록",
        spec: "얇은면 90mm",
        required: "1.000",
        unit: "EA",
        loss: "0.5%",
        status: "정상",
      },
      {
        code: "RM-SUP-021",
        name: "분말 스프",
        spec: "해물맛",
        required: "11.800",
        unit: "g",
        loss: "1.0%",
        status: "정상",
      },
      {
        code: "RM-VEG-011",
        name: "건더기",
        spec: "해물 플레이크",
        required: "2.600",
        unit: "g",
        loss: "1.2%",
        status: "주의",
      },
      {
        code: "PK-CUP-105",
        name: "컵 용기",
        spec: "105g 전용",
        required: "1.000",
        unit: "EA",
        loss: "0.3%",
        status: "정상",
      },
    ],
  },
  {
    code: "FG-BOWL-120-UDN",
    name: "왕컵 우동 120g",
    category: "대용량",
    unit: "EA",
    bomVersion: "BOM-V1.9",
    status: "사용중",
    materials: [
      {
        code: "RM-NDL-009",
        name: "우동 면 블록",
        spec: "굵은면 102mm",
        required: "1.000",
        unit: "EA",
        loss: "0.6%",
        status: "정상",
      },
      {
        code: "RM-SUP-032",
        name: "액상 스프",
        spec: "우동 베이스",
        required: "18.000",
        unit: "g",
        loss: "1.4%",
        status: "정상",
      },
      {
        code: "RM-VEG-019",
        name: "건더기",
        spec: "튀김 플레이크",
        required: "3.100",
        unit: "g",
        loss: "1.1%",
        status: "정상",
      },
      {
        code: "PK-BOWL-120",
        name: "대컵 용기",
        spec: "120g 전용",
        required: "1.000",
        unit: "EA",
        loss: "0.4%",
        status: "주의",
      },
      {
        code: "PK-BOX-024",
        name: "외포장 박스",
        spec: "24입",
        required: "0.042",
        unit: "EA",
        loss: "0.2%",
        status: "정상",
      },
    ],
  },
];

const initialCreateMaterials = [
  {
    code: "RM-NDL-001",
    name: "면 블록",
    spec: "원형 92mm",
    required: "1.000",
    unit: "EA",
    loss: "0.5%",
    process: "면 투입",
  },
  {
    code: "RM-SUP-014",
    name: "분말 스프",
    spec: "매운맛",
    required: "12.500",
    unit: "g",
    loss: "1.0%",
    process: "스프 투입",
  },
  {
    code: "RM-VEG-006",
    name: "건더기",
    spec: "건조야채 믹스",
    required: "2.200",
    unit: "g",
    loss: "0.8%",
    process: "스프 투입",
  },
  {
    code: "PK-CUP-110",
    name: "컵 용기",
    spec: "110g 전용",
    required: "1.000",
    unit: "EA",
    loss: "0.3%",
    process: "용기 공급",
  },
  {
    code: "PK-LID-110",
    name: "뚜껑 필름",
    spec: "알루미늄 라미",
    required: "1.000",
    unit: "EA",
    loss: "0.3%",
    process: "밀봉",
  },
];

const getDefaultProcess = (materialName) => {
  if (materialName.includes("면")) {
    return "면 투입";
  }

  if (materialName.includes("스프") || materialName.includes("건더기")) {
    return "스프 투입";
  }

  if (materialName.includes("용기")) {
    return "용기 공급";
  }

  if (materialName.includes("필름")) {
    return "밀봉";
  }

  return "외포장";
};

const initialBomRowsByProductId = products.reduce((rowsByProduct, product) => {
  rowsByProduct[product.code] = product.materials.map((material) => ({
    ...material,
    process: getDefaultProcess(material.name),
    note: "",
  }));

  return rowsByProduct;
}, {});

const emptyBomForm = {
  productCode: "",
  productName: "",
  bomCode: "",
  bomVersion: "",
  status: "사용중",
  note: "",
};

const getBomVersionLabel = (version) =>
  version.startsWith("BOM-") ? version : `BOM-${version}`;

function BomManagement({ showEmptyState = false }) {
  const [bomProducts, setBomProducts] = useState(products);
  const [selectedCode, setSelectedCode] = useState(products[0].code);
  const [isBomModalOpen, setIsBomModalOpen] = useState(false);
  const [bomModalMode, setBomModalMode] = useState("create");
  const [bomForm, setBomForm] = useState(emptyBomForm);
  const [bomMaterials, setBomMaterials] = useState(initialCreateMaterials);
  const [bomRowsByProductId, setBomRowsByProductId] = useState(
    initialBomRowsByProductId,
  );

  const selectedProduct = useMemo(
    () =>
      bomProducts.find((product) => product.code === selectedCode) ||
      bomProducts[0],
    [bomProducts, selectedCode],
  );

  const currentMaterials = useMemo(
    () => bomRowsByProductId[selectedCode] || [],
    [bomRowsByProductId, selectedCode],
  );

  const openCreateModal = () => {
    setBomModalMode("create");
    setBomForm(emptyBomForm);
    setBomMaterials(
      initialCreateMaterials.map((material) => ({ ...material })),
    );
    setIsBomModalOpen(true);
  };

  const openEditModal = () => {
    setBomModalMode("edit");
    setBomForm({
      productCode: selectedProduct.code,
      productName: selectedProduct.name,
      bomCode: selectedProduct.bomCode || selectedProduct.bomVersion,
      bomVersion: selectedProduct.bomVersion.replace(/^BOM-/, ""),
      status: selectedProduct.status,
      note: selectedProduct.note || "",
    });
    setBomMaterials(currentMaterials.map((material) => ({ ...material })));
    setIsBomModalOpen(true);
  };

  const closeBomModal = () => {
    setIsBomModalOpen(false);
  };

  const handleBomFormChange = (field, value) => {
    setBomForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const addBomMaterialRow = () => {
    setBomMaterials((currentRows) => [
      ...currentRows,
      {
        code: "",
        name: "",
        spec: "",
        required: "",
        unit: "EA",
        loss: "",
        process: "",
        status: "정상",
        note: "",
      },
    ]);
  };

  const updateBomMaterialRow = (targetIndex, field, value) => {
    setBomMaterials((currentRows) =>
      currentRows.map((row, index) =>
        index === targetIndex ? { ...row, [field]: value } : row,
      ),
    );
  };

  const removeBomMaterialRow = (targetIndex) => {
    setBomMaterials((currentRows) => {
      const nextRows = currentRows.filter((_, index) => index !== targetIndex);

      if (nextRows.length > 0) {
        return nextRows;
      }

      return [
        {
          code: "",
          name: "",
          spec: "",
          required: "",
          unit: "EA",
          loss: "",
          process: "",
          status: "정상",
          note: "",
        },
      ];
    });
  };

  const resetBomForm = () => {
    if (bomModalMode === "edit") {
      openEditModal();
      return;
    }

    setBomMaterials(
      initialCreateMaterials.map((material) => ({ ...material })),
    );
  };

  const handleSaveBom = () => {
    const productCode = bomForm.productCode.trim();
    const productName = bomForm.productName.trim();

    if (!productCode || !productName || !bomForm.bomVersion.trim()) {
      return;
    }

    const nextProduct = {
      code: productCode,
      name: productName,
      category: bomModalMode === "edit" ? selectedProduct.category : "컵라면",
      unit: bomModalMode === "edit" ? selectedProduct.unit : "EA",
      bomCode: bomForm.bomCode.trim(),
      bomVersion: getBomVersionLabel(bomForm.bomVersion.trim()),
      status: bomForm.status,
      note: bomForm.note.trim(),
    };
    const nextMaterials = bomMaterials.map((material) => ({
      ...material,
      status: material.status || "정상",
      note: material.note || "",
    }));

    if (bomModalMode === "edit") {
      setBomProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.code === selectedCode
            ? { ...product, ...nextProduct }
            : product,
        ),
      );
      setBomRowsByProductId((currentRowsByProduct) => ({
        ...currentRowsByProduct,
        [selectedCode]: nextMaterials,
      }));
    } else {
      setBomProducts((currentProducts) => [...currentProducts, nextProduct]);
      setBomRowsByProductId((currentRowsByProduct) => ({
        ...currentRowsByProduct,
        [productCode]: nextMaterials,
      }));
      setSelectedCode(productCode);
    }

    closeBomModal();
  };

  const materialCount = currentMaterials.length;
  const shortageCount = currentMaterials.filter(
    (material) => material.status === "부족" || material.status === "주의",
  ).length;

  if (showEmptyState) {
    return (
      <PageSection>
        <Toolbar>
          <SearchBox>
            <FiSearch aria-hidden="true" />
            <span>완제품명 또는 제품코드 검색</span>
          </SearchBox>
          <FilterButton type="button">BOM 조회</FilterButton>
        </Toolbar>
        <EmptyState>
          <FiAlertTriangle aria-hidden="true" />
          <strong>조회된 BOM 정보가 없습니다.</strong>
          <p>
            완제품을 선택하거나 검색 조건을 변경하면 등록된 BOM 자재코드를
            확인할 수 있습니다.
          </p>
        </EmptyState>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Toolbar>
        <SearchBox>
          <FiSearch aria-hidden="true" />
          <span>완제품명 또는 제품코드 검색</span>
        </SearchBox>
        <FilterButton type="button">사용중 BOM</FilterButton>
        <FilterButton type="button" onClick={openCreateModal}>
          BOM 신규 등록
        </FilterButton>
      </Toolbar>

      <BomContentGrid>
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>완제품 목록</PanelTitle>
              <SectionCaption>
                제품을 선택하면 구성 자재코드가 표시됩니다.
              </SectionCaption>
            </div>
            <HeaderMeta>{bomProducts.length} EA</HeaderMeta>
          </PanelHeader>
          <ProductList>
            {bomProducts.map((product) => (
              <ProductItem
                key={product.code}
                type="button"
                $active={selectedCode === product.code}
                onClick={() => setSelectedCode(product.code)}
              >
                <div>
                  <ProductName>{product.name}</ProductName>
                  <ProductMeta>
                    <ProductCode>{product.code}</ProductCode>
                    <span>{product.category}</span>
                    <span>{product.bomVersion}</span>
                  </ProductMeta>
                </div>
                <Badge
                  $tone={product.status === "사용중" ? "success" : "warning"}
                >
                  {product.status}
                </Badge>
                <FiChevronRight aria-hidden="true" />
              </ProductItem>
            ))}
          </ProductList>
        </Panel>

        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>{selectedProduct.name}</PanelTitle>
              <SectionCaption>
                {selectedProduct.code} · 기준 생산 단위 1 {selectedProduct.unit}
              </SectionCaption>
            </div>
            <HeaderActions>
              <Badge
                $tone={
                  selectedProduct.status === "사용중" ? "success" : "warning"
                }
              >
                {selectedProduct.bomVersion}
              </Badge>
              <ProductEditButton type="button" onClick={openEditModal}>
                <FiEdit3 aria-hidden="true" />
                수정
              </ProductEditButton>
            </HeaderActions>
          </PanelHeader>

          <PanelBody>
            <MaterialSummary>
              <SummaryCard>
                <SummaryLabel>자재코드 수</SummaryLabel>
                <SummaryValue>{materialCount}</SummaryValue>
              </SummaryCard>
              <SummaryCard>
                <SummaryLabel>점검 필요</SummaryLabel>
                <SummaryValue>{shortageCount}</SummaryValue>
              </SummaryCard>
              <SummaryCard>
                <SummaryLabel>BOM 상태</SummaryLabel>
                <SummaryValue>{selectedProduct.status}</SummaryValue>
              </SummaryCard>
            </MaterialSummary>

            <TableWrap>
              <BomTable>
                <thead>
                  <tr>
                    <th>자재코드</th>
                    <th>자재명</th>
                    <th>규격</th>
                    <th>소요량</th>
                    <th>단위</th>
                    <th>손실률</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMaterials.map((material) => (
                    <tr key={material.code}>
                      <td>{material.code}</td>
                      <td>{material.name}</td>
                      <td>{material.spec}</td>
                      <td>{material.required}</td>
                      <td>{material.unit}</td>
                      <td>{material.loss}</td>
                      <td>
                        <Badge
                          $tone={
                            material.status === "정상"
                              ? "success"
                              : material.status === "주의"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {material.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </BomTable>
            </TableWrap>
          </PanelBody>
        </Panel>
      </BomContentGrid>

      {isBomModalOpen && (
        <ModalBackdrop onClick={closeBomModal}>
          <ModalPanel
            role="dialog"
            aria-modal="true"
            aria-labelledby="bom-form-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHeader>
              <div>
                <ModalTitle id="bom-form-title">
                  {bomModalMode === "edit"
                    ? "완제품 BOM 수정"
                    : "BOM 신규 등록"}
                </ModalTitle>
                <SectionCaption>
                  {bomModalMode === "edit"
                    ? "선택한 완제품의 기본 정보와 구성 자재를 한 번에 수정합니다."
                    : "완제품 기준 자재 구성 정보를 등록합니다."}
                </SectionCaption>
              </div>
              <ModalCloseButton
                type="button"
                aria-label="모달 닫기"
                onClick={closeBomModal}
              >
                <FiX aria-hidden="true" />
              </ModalCloseButton>
            </ModalHeader>

            <ModalBody>
              <ModalSection>
                <ModalSectionHeader>
                  <ModalSectionTitle>기본 정보</ModalSectionTitle>
                </ModalSectionHeader>
                <ModalGrid>
                  <ModalField>
                    <label htmlFor="bom-product-code">완제품 코드</label>
                    <ModalInput
                      id="bom-product-code"
                      placeholder="예: FG-CUP-110-RD"
                      value={bomForm.productCode}
                      readOnly={bomModalMode === "edit"}
                      onChange={(event) =>
                        handleBomFormChange("productCode", event.target.value)
                      }
                    />
                  </ModalField>
                  <ModalField>
                    <label htmlFor="bom-product-name">완제품명</label>
                    <ModalInput
                      id="bom-product-name"
                      placeholder="예: 매운 컵라면 110g"
                      value={bomForm.productName}
                      onChange={(event) =>
                        handleBomFormChange("productName", event.target.value)
                      }
                    />
                  </ModalField>
                  <ModalField>
                    <label htmlFor="bom-code">BOM 코드</label>
                    <ModalInput
                      id="bom-code"
                      placeholder="예: BOM-CUP-RD-110"
                      value={bomForm.bomCode}
                      onChange={(event) =>
                        handleBomFormChange("bomCode", event.target.value)
                      }
                    />
                  </ModalField>
                  <ModalField>
                    <label htmlFor="bom-version">BOM 버전</label>
                    <ModalInput
                      id="bom-version"
                      placeholder="예: V3.3"
                      value={bomForm.bomVersion}
                      onChange={(event) =>
                        handleBomFormChange("bomVersion", event.target.value)
                      }
                    />
                  </ModalField>
                  <ModalField>
                    <label htmlFor="bom-status">BOM 상태</label>
                    <ModalSelect
                      id="bom-status"
                      value={bomForm.status}
                      onChange={(event) =>
                        handleBomFormChange("status", event.target.value)
                      }
                    >
                      <option>사용중</option>
                      <option>검토</option>
                      <option>미사용</option>
                    </ModalSelect>
                  </ModalField>
                  <ModalField $wide>
                    <label htmlFor="bom-note">비고</label>
                    <ModalTextarea
                      id="bom-note"
                      placeholder="등록할 BOM 구성 또는 변경 사유를 입력하세요."
                      value={bomForm.note}
                      onChange={(event) =>
                        handleBomFormChange("note", event.target.value)
                      }
                    />
                  </ModalField>
                </ModalGrid>
              </ModalSection>

              <ModalSection>
                <ModalSectionHeader>
                  <div>
                    <ModalSectionTitle>구성 자재</ModalSectionTitle>
                    <ModalSectionDescription>
                      완제품 1EA 기준으로 투입되는 자재와 기준 소요량을
                      입력합니다.
                    </ModalSectionDescription>
                  </div>
                </ModalSectionHeader>
                <MaterialTableWrap>
                  <MaterialInputTable>
                    <thead>
                      <tr>
                        <th>자재코드</th>
                        <th>자재명</th>
                        <th>규격</th>
                        <th>기준 소요량</th>
                        <th>단위</th>
                        <th>손실률</th>
                        <th>투입 공정</th>
                        <th>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bomMaterials.map((material, index) => (
                        <tr key={`${material.code || "new-material"}-${index}`}>
                          <td>
                            <TableInput
                              placeholder="RM-CODE"
                              value={material.code}
                              onChange={(event) =>
                                updateBomMaterialRow(
                                  index,
                                  "code",
                                  event.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <TableInput
                              placeholder="자재명"
                              value={material.name}
                              onChange={(event) =>
                                updateBomMaterialRow(
                                  index,
                                  "name",
                                  event.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <TableInput
                              placeholder="규격"
                              value={material.spec}
                              onChange={(event) =>
                                updateBomMaterialRow(
                                  index,
                                  "spec",
                                  event.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <TableInput
                              placeholder="0.000"
                              value={material.required}
                              onChange={(event) =>
                                updateBomMaterialRow(
                                  index,
                                  "required",
                                  event.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <TableSelect
                              value={material.unit}
                              onChange={(event) =>
                                updateBomMaterialRow(
                                  index,
                                  "unit",
                                  event.target.value,
                                )
                              }
                            >
                              <option>EA</option>
                              <option>g</option>
                              <option>kg</option>
                              <option>ml</option>
                            </TableSelect>
                          </td>
                          <td>
                            <TableInput
                              placeholder="0.0%"
                              value={material.loss}
                              onChange={(event) =>
                                updateBomMaterialRow(
                                  index,
                                  "loss",
                                  event.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <TableInput
                              placeholder="투입 공정"
                              value={material.process}
                              onChange={(event) =>
                                updateBomMaterialRow(
                                  index,
                                  "process",
                                  event.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <TableRowActionButton
                              type="button"
                              aria-label="자재 행 삭제"
                              onClick={() => removeBomMaterialRow(index)}
                            >
                              <FiTrash2 aria-hidden="true" />
                              삭제
                            </TableRowActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </MaterialInputTable>
                </MaterialTableWrap>
                <MaterialTableActions>
                  <AddRowButton type="button" onClick={addBomMaterialRow}>
                    + 자재 행 추가
                  </AddRowButton>
                  <ResetRowsButton type="button" onClick={resetBomForm}>
                    <FiRefreshCcw aria-hidden="true" />
                    입력 초기화
                  </ResetRowsButton>
                </MaterialTableActions>
                <ModalNotice>
                  BOM의 기준 소요량은 완제품 1EA 기준입니다. 작업지시가 등록되면
                  생산 목표 수량과 연결되어 예상 자재 소요량 계산에 사용합니다.
                </ModalNotice>
              </ModalSection>
            </ModalBody>

            <ModalActions>
              <ModalButton type="button" onClick={closeBomModal}>
                취소
              </ModalButton>
              <ModalButton type="button" $primary onClick={handleSaveBom}>
                {bomModalMode === "edit" ? "수정 저장" : "등록"}
              </ModalButton>
            </ModalActions>
          </ModalPanel>
        </ModalBackdrop>
      )}
    </PageSection>
  );
}

export default BomManagement;
