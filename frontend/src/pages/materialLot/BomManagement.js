import { useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiChevronRight,
  FiRefreshCcw,
  FiSearch,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import {
  Badge,
  BomContentGrid,
  BomTable,
  ClickableCellButton,
  EditFormField,
  EditFormGrid,
  EditFormLabel,
  EditSelectInput,
  EditTextArea,
  EditTextInput,
  EmptyState,
  FilterButton,
  HeaderMeta,
  MaterialEditBody,
  MaterialEditCancelButton,
  MaterialEditCloseButton,
  MaterialEditDescription,
  MaterialEditFooter,
  MaterialEditHeader,
  MaterialEditModal,
  MaterialEditNotice,
  MaterialEditOverlay,
  MaterialEditSaveButton,
  MaterialEditSection,
  MaterialEditSectionTitle,
  MaterialEditTitle,
  MaterialInfoGrid,
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
  ReadonlyInfoBox,
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
} from './BomManagementCss';

const products = [
  {
    code: 'FG-CUP-110-RD',
    name: '매운 컵라면 110g',
    category: '컵라면',
    unit: 'EA',
    bomVersion: 'BOM-V3.2',
    status: '사용중',
    materials: [
      { code: 'RM-NDL-001', name: '면 블록', spec: '원형 92mm', required: '1.000', unit: 'EA', loss: '0.5%', status: '정상' },
      { code: 'RM-SUP-014', name: '분말 스프', spec: '매운맛', required: '12.500', unit: 'g', loss: '1.0%', status: '부족' },
      { code: 'RM-VEG-006', name: '건더기', spec: '건조야채 믹스', required: '2.200', unit: 'g', loss: '0.8%', status: '정상' },
      { code: 'PK-CUP-110', name: '컵 용기', spec: '110g 전용', required: '1.000', unit: 'EA', loss: '0.3%', status: '주의' },
      { code: 'PK-LID-110', name: '뚜껑 필름', spec: '알루미늄 라미', required: '1.000', unit: 'EA', loss: '0.3%', status: '정상' },
    ],
  },
  {
    code: 'FG-CUP-105-SEA',
    name: '해물 컵라면 105g',
    category: '컵라면',
    unit: 'EA',
    bomVersion: 'BOM-V2.8',
    status: '검토',
    materials: [
      { code: 'RM-NDL-002', name: '면 블록', spec: '얇은면 90mm', required: '1.000', unit: 'EA', loss: '0.5%', status: '정상' },
      { code: 'RM-SUP-021', name: '분말 스프', spec: '해물맛', required: '11.800', unit: 'g', loss: '1.0%', status: '정상' },
      { code: 'RM-VEG-011', name: '건더기', spec: '해물 플레이크', required: '2.600', unit: 'g', loss: '1.2%', status: '주의' },
      { code: 'PK-CUP-105', name: '컵 용기', spec: '105g 전용', required: '1.000', unit: 'EA', loss: '0.3%', status: '정상' },
    ],
  },
  {
    code: 'FG-BOWL-120-UDN',
    name: '왕컵 우동 120g',
    category: '대용량',
    unit: 'EA',
    bomVersion: 'BOM-V1.9',
    status: '사용중',
    materials: [
      { code: 'RM-NDL-009', name: '우동 면 블록', spec: '굵은면 102mm', required: '1.000', unit: 'EA', loss: '0.6%', status: '정상' },
      { code: 'RM-SUP-032', name: '액상 스프', spec: '우동 베이스', required: '18.000', unit: 'g', loss: '1.4%', status: '정상' },
      { code: 'RM-VEG-019', name: '건더기', spec: '튀김 플레이크', required: '3.100', unit: 'g', loss: '1.1%', status: '정상' },
      { code: 'PK-BOWL-120', name: '대컵 용기', spec: '120g 전용', required: '1.000', unit: 'EA', loss: '0.4%', status: '주의' },
      { code: 'PK-BOX-024', name: '외포장 박스', spec: '24입', required: '0.042', unit: 'EA', loss: '0.2%', status: '정상' },
    ],
  },
];

const initialCreateMaterials = [
  {
    code: 'RM-NDL-001',
    name: '면 블록',
    spec: '원형 92mm',
    required: '1.000',
    unit: 'EA',
    loss: '0.5%',
    process: '면 투입',
  },
  {
    code: 'RM-SUP-014',
    name: '분말 스프',
    spec: '매운맛',
    required: '12.500',
    unit: 'g',
    loss: '1.0%',
    process: '스프 투입',
  },
  {
    code: 'RM-VEG-006',
    name: '건더기',
    spec: '건조야채 믹스',
    required: '2.200',
    unit: 'g',
    loss: '0.8%',
    process: '스프 투입',
  },
  {
    code: 'PK-CUP-110',
    name: '컵 용기',
    spec: '110g 전용',
    required: '1.000',
    unit: 'EA',
    loss: '0.3%',
    process: '용기 공급',
  },
  {
    code: 'PK-LID-110',
    name: '뚜껑 필름',
    spec: '알루미늄 라미',
    required: '1.000',
    unit: 'EA',
    loss: '0.3%',
    process: '밀봉',
  },
];

const getDefaultProcess = (materialName) => {
  if (materialName.includes('면')) {
    return '면 투입';
  }

  if (materialName.includes('스프') || materialName.includes('건더기')) {
    return '스프 투입';
  }

  if (materialName.includes('용기')) {
    return '용기 공급';
  }

  if (materialName.includes('필름')) {
    return '밀봉';
  }

  return '외포장';
};

const initialBomRowsByProductId = products.reduce((rowsByProduct, product) => {
  rowsByProduct[product.code] = product.materials.map((material) => ({
    ...material,
    process: getDefaultProcess(material.name),
    note: '',
  }));

  return rowsByProduct;
}, {});

function BomManagement({ showEmptyState = false }) {
  const [selectedCode, setSelectedCode] = useState(products[0].code);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMaterials, setCreateMaterials] = useState(initialCreateMaterials);
  const [materialFormKey, setMaterialFormKey] = useState(0);
  const [bomRowsByProductId, setBomRowsByProductId] = useState(initialBomRowsByProductId);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isMaterialEditModalOpen, setIsMaterialEditModalOpen] = useState(false);
  const [materialEditForm, setMaterialEditForm] = useState({
    requiredQty: '',
    unit: '',
    lossRate: '',
    process: '',
    status: '',
    note: '',
  });

  const selectedProduct = useMemo(
    () => products.find((product) => product.code === selectedCode) || products[0],
    [selectedCode]
  );

  const currentMaterials = useMemo(
    () => bomRowsByProductId[selectedCode] || [],
    [bomRowsByProductId, selectedCode]
  );

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const addCreateMaterialRow = () => {
    setCreateMaterials((currentRows) => [
      ...currentRows,
      { code: '', name: '', spec: '', required: '', unit: 'EA', loss: '', process: '' },
    ]);
  };

  const removeCreateMaterialRow = (targetIndex) => {
    setCreateMaterials((currentRows) => {
      const nextRows = currentRows.filter((_, index) => index !== targetIndex);

      if (nextRows.length > 0) {
        return nextRows;
      }

      return [{ code: '', name: '', spec: '', required: '', unit: 'EA', loss: '', process: '' }];
    });
  };

  const resetCreateMaterialRows = () => {
    setCreateMaterials(initialCreateMaterials);
    setMaterialFormKey((currentKey) => currentKey + 1);
  };

  const openMaterialEditModal = (material) => {
    setSelectedMaterial(material);
    setMaterialEditForm({
      requiredQty: material.required,
      unit: material.unit,
      lossRate: material.loss,
      process: material.process || '',
      status: material.status,
      note: material.note || '',
    });
    setIsMaterialEditModalOpen(true);
  };

  const closeMaterialEditModal = () => {
    setIsMaterialEditModalOpen(false);
    setSelectedMaterial(null);
  };

  const handleMaterialEditFormChange = (field, value) => {
    setMaterialEditForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSaveMaterialEdit = () => {
    if (!selectedMaterial) {
      return;
    }

    setBomRowsByProductId((currentRowsByProduct) => ({
      ...currentRowsByProduct,
      [selectedCode]: currentRowsByProduct[selectedCode].map((row) =>
        row.code === selectedMaterial.code
          ? {
              ...row,
              required: materialEditForm.requiredQty,
              unit: materialEditForm.unit,
              loss: materialEditForm.lossRate,
              process: materialEditForm.process,
              status: materialEditForm.status,
              note: materialEditForm.note,
            }
          : row
      ),
    }));

    closeMaterialEditModal();
  };

  const materialCount = currentMaterials.length;
  const shortageCount = currentMaterials.filter(
    (material) => material.status === '부족' || material.status === '주의'
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
          <p>완제품을 선택하거나 검색 조건을 변경하면 등록된 BOM 자재코드를 확인할 수 있습니다.</p>
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
        <FilterButton type="button" onClick={() => setIsCreateModalOpen(true)}>
          BOM 신규 등록
        </FilterButton>
      </Toolbar>

      <BomContentGrid>
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>완제품 목록</PanelTitle>
              <SectionCaption>제품을 선택하면 구성 자재코드가 표시됩니다.</SectionCaption>
            </div>
            <HeaderMeta>{products.length} EA</HeaderMeta>
          </PanelHeader>
          <ProductList>
            {products.map((product) => (
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
                <Badge $tone={product.status === '사용중' ? 'success' : 'warning'}>
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
            <Badge $tone={selectedProduct.status === '사용중' ? 'success' : 'warning'}>
              {selectedProduct.bomVersion}
            </Badge>
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
                      <td>
                        <ClickableCellButton
                          type="button"
                          onClick={() => openMaterialEditModal(material)}
                        >
                          {material.code}
                        </ClickableCellButton>
                      </td>
                      <td>
                        <ClickableCellButton
                          type="button"
                          onClick={() => openMaterialEditModal(material)}
                        >
                          {material.name}
                        </ClickableCellButton>
                      </td>
                      <td>{material.spec}</td>
                      <td>{material.required}</td>
                      <td>{material.unit}</td>
                      <td>{material.loss}</td>
                      <td>
                        <Badge
                          $tone={
                            material.status === '정상'
                              ? 'success'
                              : material.status === '주의'
                                ? 'warning'
                                : 'danger'
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

      {isCreateModalOpen && (
        <ModalBackdrop onClick={closeCreateModal}>
          <ModalPanel
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-bom-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHeader>
              <div>
                <ModalTitle id="create-bom-title">BOM 신규 등록</ModalTitle>
                <SectionCaption>완제품 기준 자재 구성 정보를 등록합니다.</SectionCaption>
              </div>
              <ModalCloseButton type="button" aria-label="모달 닫기" onClick={closeCreateModal}>
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
                    <ModalInput id="bom-product-code" placeholder="예: FG-CUP-110-RD" />
                  </ModalField>
                  <ModalField>
                    <label htmlFor="bom-product-name">완제품명</label>
                    <ModalInput id="bom-product-name" placeholder="예: 매운 컵라면 110g" />
                  </ModalField>
                  <ModalField>
                    <label htmlFor="bom-code">BOM 코드</label>
                    <ModalInput id="bom-code" placeholder="예: BOM-CUP-RD-110" />
                  </ModalField>
                  <ModalField>
                    <label htmlFor="bom-version">BOM 버전</label>
                    <ModalInput id="bom-version" placeholder="예: V3.3" />
                  </ModalField>
                  <ModalField>
                    <label htmlFor="bom-status">BOM 상태</label>
                    <ModalSelect id="bom-status" defaultValue="사용중">
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
                    />
                  </ModalField>
                </ModalGrid>
              </ModalSection>

              <ModalSection>
                <ModalSectionHeader>
                  <div>
                    <ModalSectionTitle>구성 자재</ModalSectionTitle>
                    <ModalSectionDescription>
                      완제품 1EA 기준으로 투입되는 자재와 기준 소요량을 입력합니다.
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
                      {createMaterials.map((material, index) => (
                        <tr key={`${materialFormKey}-${material.code || 'new-material'}-${index}`}>
                          <td>
                            <TableInput placeholder="RM-CODE" defaultValue={material.code} />
                          </td>
                          <td>
                            <TableInput placeholder="자재명" defaultValue={material.name} />
                          </td>
                          <td>
                            <TableInput placeholder="규격" defaultValue={material.spec} />
                          </td>
                          <td>
                            <TableInput placeholder="0.000" defaultValue={material.required} />
                          </td>
                          <td>
                            <TableSelect defaultValue={material.unit}>
                              <option>EA</option>
                              <option>g</option>
                              <option>kg</option>
                              <option>ml</option>
                            </TableSelect>
                          </td>
                          <td>
                            <TableInput placeholder="0.0%" defaultValue={material.loss} />
                          </td>
                          <td>
                            <TableInput placeholder="투입 공정" defaultValue={material.process} />
                          </td>
                          <td>
                            <TableRowActionButton
                              type="button"
                              aria-label="자재 행 삭제"
                              onClick={() => removeCreateMaterialRow(index)}
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
                  <AddRowButton type="button" onClick={addCreateMaterialRow}>
                    + 자재 행 추가
                  </AddRowButton>
                  <ResetRowsButton type="button" onClick={resetCreateMaterialRows}>
                    <FiRefreshCcw aria-hidden="true" />
                    입력 초기화
                  </ResetRowsButton>
                </MaterialTableActions>
                <ModalNotice>
                  BOM의 기준 소요량은 완제품 1EA 기준입니다. 작업지시가 등록되면 생산 목표
                  수량과 연결되어 예상 자재 소요량 계산에 사용합니다.
                </ModalNotice>
              </ModalSection>
            </ModalBody>

            <ModalActions>
              <ModalButton type="button" onClick={closeCreateModal}>
                취소
              </ModalButton>
              <ModalButton type="button" $primary onClick={closeCreateModal}>
                등록
              </ModalButton>
            </ModalActions>
          </ModalPanel>
        </ModalBackdrop>
      )}

      {isMaterialEditModalOpen && selectedMaterial && (
        <MaterialEditOverlay onClick={closeMaterialEditModal}>
          <MaterialEditModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="material-edit-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <MaterialEditHeader>
              <div>
                <MaterialEditTitle id="material-edit-modal-title">
                  BOM 구성 자재 수정
                </MaterialEditTitle>
                <MaterialEditDescription>
                  선택한 자재의 기준 소요량, 손실률, 투입 공정 정보를 수정합니다.
                </MaterialEditDescription>
              </div>
              <MaterialEditCloseButton
                type="button"
                aria-label="BOM 구성 자재 수정 모달 닫기"
                onClick={closeMaterialEditModal}
              >
                <FiX aria-hidden="true" />
              </MaterialEditCloseButton>
            </MaterialEditHeader>

            <MaterialEditBody>
              <MaterialEditSection>
                <MaterialEditSectionTitle>선택 자재 정보</MaterialEditSectionTitle>
                <MaterialInfoGrid>
                  <ReadonlyInfoBox>
                    <span>자재코드</span>
                    <strong>{selectedMaterial.code}</strong>
                  </ReadonlyInfoBox>
                  <ReadonlyInfoBox>
                    <span>자재명</span>
                    <strong>{selectedMaterial.name}</strong>
                  </ReadonlyInfoBox>
                  <ReadonlyInfoBox>
                    <span>규격</span>
                    <strong>{selectedMaterial.spec}</strong>
                  </ReadonlyInfoBox>
                </MaterialInfoGrid>
                <MaterialEditNotice>
                  자재코드와 자재명은 자재 관리 화면에서 수정하는 기준정보입니다.
                </MaterialEditNotice>
              </MaterialEditSection>

              <MaterialEditSection>
                <MaterialEditSectionTitle>BOM 구성 정보</MaterialEditSectionTitle>
                <EditFormGrid>
                  <EditFormField>
                    <EditFormLabel htmlFor="edit-required-qty">기준 소요량</EditFormLabel>
                    <EditTextInput
                      id="edit-required-qty"
                      value={materialEditForm.requiredQty}
                      onChange={(event) =>
                        handleMaterialEditFormChange('requiredQty', event.target.value)
                      }
                      placeholder="예: 1.000"
                    />
                  </EditFormField>
                  <EditFormField>
                    <EditFormLabel htmlFor="edit-unit">단위</EditFormLabel>
                    <EditSelectInput
                      id="edit-unit"
                      value={materialEditForm.unit}
                      onChange={(event) =>
                        handleMaterialEditFormChange('unit', event.target.value)
                      }
                    >
                      <option>EA</option>
                      <option>g</option>
                      <option>kg</option>
                      <option>ml</option>
                      <option>L</option>
                      <option>BOX</option>
                    </EditSelectInput>
                  </EditFormField>
                  <EditFormField>
                    <EditFormLabel htmlFor="edit-loss-rate">손실률</EditFormLabel>
                    <EditTextInput
                      id="edit-loss-rate"
                      value={materialEditForm.lossRate}
                      onChange={(event) =>
                        handleMaterialEditFormChange('lossRate', event.target.value)
                      }
                      placeholder="예: 0.5%"
                    />
                  </EditFormField>
                  <EditFormField>
                    <EditFormLabel htmlFor="edit-process">투입 공정</EditFormLabel>
                    <EditSelectInput
                      id="edit-process"
                      value={materialEditForm.process}
                      onChange={(event) =>
                        handleMaterialEditFormChange('process', event.target.value)
                      }
                    >
                      <option>면 투입</option>
                      <option>스프 투입</option>
                      <option>용기 공급</option>
                      <option>밀봉</option>
                      <option>외포장</option>
                      <option>박스 포장</option>
                    </EditSelectInput>
                  </EditFormField>
                  <EditFormField>
                    <EditFormLabel htmlFor="edit-status">상태</EditFormLabel>
                    <EditSelectInput
                      id="edit-status"
                      value={materialEditForm.status}
                      onChange={(event) =>
                        handleMaterialEditFormChange('status', event.target.value)
                      }
                    >
                      <option>정상</option>
                      <option>주의</option>
                      <option>부족</option>
                    </EditSelectInput>
                  </EditFormField>
                  <EditFormField $wide>
                    <EditFormLabel htmlFor="edit-note">비고</EditFormLabel>
                    <EditTextArea
                      id="edit-note"
                      value={materialEditForm.note}
                      onChange={(event) =>
                        handleMaterialEditFormChange('note', event.target.value)
                      }
                      placeholder="변경 사유 또는 확인 내용을 입력하세요."
                    />
                  </EditFormField>
                </EditFormGrid>
              </MaterialEditSection>
            </MaterialEditBody>

            <MaterialEditFooter>
              <MaterialEditCancelButton type="button" onClick={closeMaterialEditModal}>
                취소
              </MaterialEditCancelButton>
              <MaterialEditSaveButton type="button" onClick={handleSaveMaterialEdit}>
                수정 저장
              </MaterialEditSaveButton>
            </MaterialEditFooter>
          </MaterialEditModal>
        </MaterialEditOverlay>
      )}
    </PageSection>
  );
}

export default BomManagement;
