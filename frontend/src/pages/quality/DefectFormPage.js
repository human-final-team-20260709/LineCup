import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiArrowLeft, FiCheck, FiClipboard, FiInfo, FiRefreshCcw } from 'react-icons/fi';
import {
  Page, PageHeader, TitleGroup, Eyebrow, HeaderActions, Button, StateSwitch, StateButton,
  FormLayout, FormCard, CardHeader, PanelLabel, Section, SectionTitle, FieldGrid, Field, Label,
  Required, Select, Input, Textarea, HelpText, MethodGrid, MethodOption, RadioMark, SummaryCard,
  SummaryList, SummaryRow, StatusChip, Notice, FormActions, Toast,
} from './DefectFormPageCss';

const initialForm = {
  workOrder: 'WO-20260713-001', lot: 'LOT-P-260713-028', process: '유탕', defectType: '유탕 온도 편차',
  quantity: '8', cause: '유탕기 온도 센서 순간 편차로 기준 온도가 상한값을 초과함', method: '재작업',
  owner: '정유진', status: '처리 중',
};

function DefectFormPage() {
  const navigate = useNavigate();
  const [showEmpty, setShowEmpty] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saved, setSaved] = useState(false);

  const update = (name) => (event) => {
    setSaved(false);
    setForm((current) => ({ ...current, [name]: event.target.value }));
  };
  const reset = () => { setForm(initialForm); setSaved(false); };
  const submitPreview = (event) => { event.preventDefault(); setSaved(true); };

  return (
    <Page>
      <PageHeader>
        <TitleGroup><Eyebrow>Quality Control / Registration</Eyebrow><h1>불량 등록 및 처리</h1><p>생산 이력에 불량 정보를 연결하고 초기 처리 계획을 기록합니다.</p></TitleGroup>
        <HeaderActions>
          <Button type="button" onClick={() => navigate('/quality/defects')}><FiArrowLeft /> 목록으로</Button>
          <Button type="button" onClick={reset}><FiRefreshCcw /> 초기화</Button>
        </HeaderActions>
      </PageHeader>

      <StateSwitch aria-label="연결 데이터 상태 미리보기">
        <StateButton type="button" $active={!showEmpty} onClick={() => setShowEmpty(false)}>선택 데이터 있음</StateButton>
        <StateButton type="button" $active={showEmpty} onClick={() => setShowEmpty(true)}>선택 데이터 없음</StateButton>
      </StateSwitch>

      <form onSubmit={submitPreview}>
        <FormLayout>
          <FormCard>
            <CardHeader><div><PanelLabel>Defect Information</PanelLabel><h2>발생 정보</h2></div><FiClipboard aria-hidden="true" /></CardHeader>
            <Section>
              <SectionTitle>생산 추적 정보</SectionTitle>
              <FieldGrid>
                <Field><Label htmlFor="workOrder">작업지시 선택 <Required>*</Required></Label><Select id="workOrder" value={showEmpty ? '' : form.workOrder} onChange={update('workOrder')} disabled={showEmpty} required><option value="">작업지시를 선택하세요</option>{!showEmpty && <><option value="WO-20260713-001">WO-20260713-001 · 얼큰 컵누들</option><option value="WO-20260713-002">WO-20260713-002 · 고소 크림누들</option><option value="WO-20260713-003">WO-20260713-003 · 매콤 볶음누들</option></>}</Select>{showEmpty && <HelpText $warning>선택 가능한 진행 중 작업지시가 없습니다.</HelpText>}</Field>
                <Field><Label htmlFor="lot">생산 LOT 선택 <Required>*</Required></Label><Select id="lot" value={showEmpty ? '' : form.lot} onChange={update('lot')} disabled={showEmpty} required><option value="">생산 LOT를 선택하세요</option>{!showEmpty && <><option>LOT-P-260713-028</option><option>LOT-P-260713-027</option><option>LOT-P-260713-023</option></>}</Select><HelpText>선택한 작업지시에 연결된 LOT만 표시됩니다.</HelpText></Field>
                <Field><Label htmlFor="process">발생 공정 선택 <Required>*</Required></Label><Select id="process" value={form.process} onChange={update('process')} required><option>배합</option><option>제면</option><option>증숙</option><option>건조</option><option>유탕</option><option>포장</option><option>검사</option></Select></Field>
                <Field><Label htmlFor="defectType">불량 유형 선택 <Required>*</Required></Label><Select id="defectType" value={form.defectType} onChange={update('defectType')} required><option>유탕 온도 편차</option><option>면 중량 편차</option><option>수분 함량 초과</option><option>실링 불량</option><option>용기 변형</option><option>기타</option></Select></Field>
                <Field><Label htmlFor="quantity">불량 수량 <Required>*</Required></Label><Input id="quantity" type="number" min="1" value={form.quantity} onChange={update('quantity')} required /><HelpText>단위: EA</HelpText></Field>
              </FieldGrid>
            </Section>
            <Section>
              <SectionTitle>원인 및 처리 계획</SectionTitle>
              <Field><Label htmlFor="cause">불량 원인 <Required>*</Required></Label><Textarea id="cause" rows="4" value={form.cause} onChange={update('cause')} placeholder="확인된 원인 또는 추정 원인을 입력하세요." required /></Field>
              <Field><Label>처리 방법 <Required>*</Required></Label><MethodGrid>
                {[
                  { value: '정상 승인', desc: '품질 기준 검토 후 정상 제품으로 승인' },
                  { value: '재작업', desc: '재작업 공정으로 이동하여 품질 재검사' },
                  { value: '폐기', desc: '사용 불가 판정 후 폐기 수량으로 반영' },
                ].map((item) => <MethodOption key={item.value} $active={form.method === item.value}>
                  <input type="radio" name="method" value={item.value} checked={form.method === item.value} onChange={update('method')} />
                  <RadioMark>{form.method === item.value && <FiCheck />}</RadioMark><span><strong>{item.value}</strong><small>{item.desc}</small></span>
                </MethodOption>)}
              </MethodGrid></Field>
              <FieldGrid>
                <Field><Label htmlFor="owner">처리 담당자 <Required>*</Required></Label><Select id="owner" value={form.owner} onChange={update('owner')} required><option>정유진</option><option>김민재</option><option>박현우</option><option>이서연</option></Select></Field>
                <Field><Label htmlFor="status">처리 상태 <Required>*</Required></Label><Select id="status" value={form.status} onChange={update('status')} required><option>미처리</option><option>처리 중</option><option>처리 완료</option><option>보류</option></Select></Field>
              </FieldGrid>
            </Section>
          </FormCard>

          <SummaryCard>
            <PanelLabel>Registration Summary</PanelLabel><h2>등록 요약</h2>
            <SummaryList>
              <SummaryRow><span>작업지시</span><strong>{showEmpty ? '미선택' : form.workOrder}</strong></SummaryRow>
              <SummaryRow><span>생산 LOT</span><strong>{showEmpty ? '미선택' : form.lot}</strong></SummaryRow>
              <SummaryRow><span>발생 공정</span><strong>{form.process}</strong></SummaryRow>
              <SummaryRow><span>불량 유형</span><strong>{form.defectType}</strong></SummaryRow>
              <SummaryRow><span>불량 수량</span><strong>{form.quantity || 0} EA</strong></SummaryRow>
              <SummaryRow><span>처리 방법</span><strong>{form.method}</strong></SummaryRow>
              <SummaryRow><span>처리 상태</span><StatusChip $status={form.status}>{form.status}</StatusChip></SummaryRow>
            </SummaryList>
            <Notice $warning={showEmpty}>{showEmpty ? <FiAlertTriangle /> : <FiInfo />}<span>{showEmpty ? '연결할 생산 이력이 없어 등록할 수 없습니다.' : '실제 저장이나 서버 전송 없이 UI 상태만 확인됩니다.'}</span></Notice>
          </SummaryCard>
        </FormLayout>
        <FormActions><Button type="button" onClick={() => navigate('/quality/defects')}>취소</Button><Button $primary type="submit" disabled={showEmpty}><FiCheck /> 불량 등록</Button></FormActions>
      </form>
      {saved && <Toast role="status"><FiCheck /><span><strong>등록 미리보기가 완료되었습니다.</strong> 실제 데이터는 저장되지 않습니다.</span></Toast>}
    </Page>
  );
}

export default DefectFormPage;
