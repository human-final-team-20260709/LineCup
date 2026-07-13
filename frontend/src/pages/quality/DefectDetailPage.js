import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiAlertTriangle, FiArrowLeft, FiCheck, FiCheckCircle, FiClock, FiEdit3, FiPackage, FiUser } from 'react-icons/fi';
import {
  Page, PageHeader, TitleGroup, Eyebrow, HeaderActions, Button, StateSwitch, StateButton, StatusChip,
  MetricGrid, MetricCard, MetricLabel, MetricValue, DetailGrid, Panel, PanelHeader, PanelLabel,
  InfoGrid, InfoItem, Mono, Description, MethodBadge, Timeline, TimelineItem, TimelineDot,
  TreatmentForm, FieldGrid, Field, Label, Select, Textarea, FormActions, Notice, EmptyState,
} from './DefectDetailPageCss';

const defect = {
  id: 'DF-260713-024', occurredAt: '2026-07-13 14:32:18', product: '매콤 볶음누들', productCode: 'PRD-NDL-003',
  workOrder: 'WO-20260713-003', lot: 'LOT-P-260713-031', process: '포장', equipment: '포장기 PK-02',
  type: '실링 불량', quantity: 12, inspector: '이서연', cause: '포장 필름 장력 편차로 용기 상단 일부 구간의 실링 압력이 기준값에 미달했습니다. 해당 시점 생산품을 격리하고 샘플 검사 결과 재작업 가능한 상태로 판정했습니다.',
  method: '재작업', owner: '김민재', status: '처리 중',
};

const history = [
  { time: '2026-07-13 14:32', title: '불량 등록', description: '검사 공정에서 실링 불량 12 EA 확인', tone: 'alarm' },
  { time: '2026-07-13 14:38', title: '격리 처리', description: '대상 LOT 출고 보류 및 불량품 격리', tone: 'warning' },
  { time: '2026-07-13 14:51', title: '담당자 지정', description: '김민재 담당자에게 재작업 요청', tone: 'primary' },
];

function DefectDetailPage() {
  const navigate = useNavigate();
  const { defectId } = useParams();
  const [showEmpty, setShowEmpty] = useState(false);
  const [method, setMethod] = useState(defect.method);
  const [owner, setOwner] = useState(defect.owner);
  const [status, setStatus] = useState(defect.status);
  const [note, setNote] = useState('실링 장력 보정 후 재포장 진행 예정');
  const [saved, setSaved] = useState(false);

  const savePreview = (event) => { event.preventDefault(); setSaved(true); };

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Quality Control / Defect Detail</Eyebrow>
          <div><h1>불량 상세</h1>{!showEmpty && <StatusChip $status={status}>{status}</StatusChip>}</div>
          <p>{showEmpty ? '조회된 불량 정보가 없습니다.' : `${defectId || defect.id} · ${defect.product}`}</p>
        </TitleGroup>
        <HeaderActions><Button type="button" onClick={() => navigate('/quality/defects')}><FiArrowLeft /> 목록으로</Button>{!showEmpty && <Button type="button" onClick={() => navigate('/quality/defects/new')}><FiEdit3 /> 새 불량 등록</Button>}</HeaderActions>
      </PageHeader>

      <StateSwitch aria-label="상세 데이터 상태 미리보기">
        <StateButton type="button" $active={!showEmpty} onClick={() => setShowEmpty(false)}>데이터 있음</StateButton>
        <StateButton type="button" $active={showEmpty} onClick={() => setShowEmpty(true)}>데이터 없음</StateButton>
      </StateSwitch>

      {showEmpty ? (
        <EmptyState><FiCheckCircle /><strong>불량 상세 정보가 없습니다.</strong><span>삭제되었거나 존재하지 않는 불량 번호입니다.</span><Button type="button" onClick={() => navigate('/quality/defects')}>불량 목록으로 이동</Button></EmptyState>
      ) : (
        <>
          <MetricGrid>
            <MetricCard><MetricLabel><FiAlertTriangle /> 불량 수량</MetricLabel><MetricValue $alarm>{defect.quantity}<small>EA</small></MetricValue></MetricCard>
            <MetricCard><MetricLabel><FiClock /> 발생 일시</MetricLabel><MetricValue $small>{defect.occurredAt}</MetricValue></MetricCard>
            <MetricCard><MetricLabel><FiPackage /> 발생 공정</MetricLabel><MetricValue $small>{defect.process}<small>{defect.equipment}</small></MetricValue></MetricCard>
            <MetricCard><MetricLabel><FiUser /> 검사 담당자</MetricLabel><MetricValue $small>{defect.inspector}</MetricValue></MetricCard>
          </MetricGrid>

          <DetailGrid>
            <div>
              <Panel>
                <PanelHeader><div><PanelLabel>Traceability</PanelLabel><h2>발생 및 추적 정보</h2></div><Mono>{defect.id}</Mono></PanelHeader>
                <InfoGrid>
                  <InfoItem><span>제품명</span><strong>{defect.product}</strong><small>{defect.productCode}</small></InfoItem>
                  <InfoItem><span>작업지시 번호</span><Mono>{defect.workOrder}</Mono></InfoItem>
                  <InfoItem><span>생산 LOT 번호</span><Mono>{defect.lot}</Mono></InfoItem>
                  <InfoItem><span>불량 유형</span><strong>{defect.type}</strong></InfoItem>
                  <InfoItem><span>발생 공정</span><strong>{defect.process}</strong><small>{defect.equipment}</small></InfoItem>
                  <InfoItem><span>처리 방법</span><MethodBadge>{method}</MethodBadge></InfoItem>
                </InfoGrid>
              </Panel>
              <Panel>
                <PanelHeader><div><PanelLabel>Root Cause</PanelLabel><h2>불량 원인</h2></div></PanelHeader>
                <Description>{defect.cause}</Description>
              </Panel>
              <Panel>
                <PanelHeader><div><PanelLabel>Process History</PanelLabel><h2>처리 이력</h2></div><Mono>{history.length} events</Mono></PanelHeader>
                <Timeline>{history.map((item) => <TimelineItem key={item.time}><TimelineDot $tone={item.tone} /><div><Mono>{item.time}</Mono><strong>{item.title}</strong><span>{item.description}</span></div></TimelineItem>)}</Timeline>
              </Panel>
            </div>

            <Panel $sticky>
              <PanelHeader><div><PanelLabel>Disposition</PanelLabel><h2>불량 처리</h2></div></PanelHeader>
              <TreatmentForm onSubmit={savePreview}>
                <Field><Label htmlFor="method">처리 방법</Label><Select id="method" value={method} onChange={(event) => { setMethod(event.target.value); setSaved(false); }}><option>정상 승인</option><option>재작업</option><option>폐기</option></Select></Field>
                <FieldGrid>
                  <Field><Label htmlFor="owner">처리 담당자</Label><Select id="owner" value={owner} onChange={(event) => { setOwner(event.target.value); setSaved(false); }}><option>김민재</option><option>정유진</option><option>박현우</option><option>이서연</option></Select></Field>
                  <Field><Label htmlFor="status">처리 상태</Label><Select id="status" value={status} onChange={(event) => { setStatus(event.target.value); setSaved(false); }}><option>미처리</option><option>처리 중</option><option>처리 완료</option><option>보류</option></Select></Field>
                </FieldGrid>
                <Field><Label htmlFor="note">처리 내용</Label><Textarea id="note" rows="5" value={note} onChange={(event) => { setNote(event.target.value); setSaved(false); }} placeholder="조치 내용과 확인 결과를 입력하세요." /></Field>
                <Notice $success={saved}>{saved ? <FiCheck /> : <FiAlertTriangle />}<span>{saved ? '처리 상태 미리보기가 반영되었습니다.' : '이 화면의 변경 내용은 서버에 저장되지 않습니다.'}</span></Notice>
                <FormActions><Button type="button" onClick={() => { setMethod(defect.method); setOwner(defect.owner); setStatus(defect.status); setNote('실링 장력 보정 후 재포장 진행 예정'); setSaved(false); }}>취소</Button><Button $primary type="submit"><FiCheck /> 처리 내용 반영</Button></FormActions>
              </TreatmentForm>
            </Panel>
          </DetailGrid>
        </>
      )}
    </Page>
  );
}

export default DefectDetailPage;
