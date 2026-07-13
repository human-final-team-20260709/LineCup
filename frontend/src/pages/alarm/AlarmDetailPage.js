import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AlarmDetailPage.css';
import {
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiMapPin,
  FiTool,
} from 'react-icons/fi';

const alarmDetail = {
  id: 'ALM-260709-017',
  equipment: '증숙기 ST-01',
  process: '증숙 공정',
  location: '증숙 공정 / 스팀 밸브 #2',
  message: '스팀 압력 상한 초과',
  description: '증숙기 스팀 압력이 설정 상한값 0.62MPa를 초과했습니다. 제품 품질 편차와 설비 정지 가능성이 있어 즉시 확인이 필요합니다.',
  severity: 'critical',
  severityLabel: '심각',
  occurredAt: '2026-07-09 18:35:03',
  clearedAt: '미해제',
  handler: '박현우',
  status: '조치 중',
  action: '스팀 조절 밸브 개도율 확인 중이며, 압력 안정화 후 제품 샘플 품질 확인 예정입니다.',
};

const alarmDetails = {
  [alarmDetail.id]: alarmDetail,
  'ALM-260709-018': {
    ...alarmDetail,
    id: 'ALM-260709-018',
    equipment: '배합기 MX-01',
    process: '배합 공정',
    location: '배합 공정 / 원료 계량부',
    message: '분말 투입 계량 인터록 센서 응답 지연',
    description: '배합기 MX-01의 계량 인터록 센서 응답이 기준 시간보다 늦어졌습니다. 원료 투입 상태와 센서 연결 상태를 확인해야 합니다.',
    severity: 'warning',
    severityLabel: '경고',
    occurredAt: '2026-07-09 18:42:15',
    clearedAt: '미해제',
    handler: '미배정',
    status: '확인 대기',
    action: '센서 응답 로그와 원료 투입 밸브 상태를 확인한 뒤 담당자를 배정합니다.',
  },
  'ALM-260709-016': {
    ...alarmDetail,
    id: 'ALM-260709-016',
    equipment: '튀김기 FR-01',
    process: '튀김 공정',
    location: '튀김 공정 / 순환 펌프',
    message: '유온 순환 펌프 진동값 기준치 근접',
    description: '튀김기 FR-01의 순환 펌프 진동값이 관리 기준치에 근접했습니다. 베어링 상태와 펌프 체결부 확인이 필요합니다.',
    severity: 'warning',
    severityLabel: '경고',
    occurredAt: '2026-07-09 18:21:48',
    clearedAt: '미해제',
    handler: '정유진',
    status: '점검 예약',
    action: '다음 정지 시간에 펌프 진동 재측정과 체결부 점검을 진행합니다.',
  },
  'ALM-260709-015': {
    ...alarmDetail,
    id: 'ALM-260709-015',
    equipment: '검사기 IN-01',
    process: '검사 공정',
    location: '검사 공정 / 중량 검사 센서',
    message: '제품 중량 검사값 일시 변동 감지',
    description: '검사기 IN-01에서 제품 중량 검사값이 일시적으로 흔들렸습니다. 생산 영향은 낮지만 추세 확인이 필요합니다.',
    severity: 'info',
    severityLabel: '정보',
    occurredAt: '2026-07-09 18:08:22',
    clearedAt: '2026-07-09 18:10:12',
    handler: '라인 A',
    status: '모니터링',
    action: '중량 검사 추세를 모니터링하고 반복 발생 시 보정 작업을 진행합니다.',
  },
  'ALM-260709-014': {
    ...alarmDetail,
    id: 'ALM-260709-014',
    equipment: '포장기 PK-01',
    process: '포장 공정',
    location: '포장 공정 / 필름 텐션부',
    message: '포장 텐션 온도 경고',
    description: '포장기 PK-01의 텐션 제어부 온도가 경고 기준에 도달했습니다. 냉각 팬과 제어부 상태를 확인합니다.',
    severity: 'warning',
    severityLabel: '경고',
    occurredAt: '2026-07-09 17:58:44',
    clearedAt: '2026-07-09 18:06:12',
    handler: '김민재',
    status: '처리 완료',
    action: '팬 동작과 제어부 상태를 확인했고 온도가 정상 범위로 복귀했습니다.',
  },
  'ALM-260709-013': {
    ...alarmDetail,
    id: 'ALM-260709-013',
    equipment: '튀김기 FR-01',
    process: '튀김 공정',
    location: '튀김 공정 / 유온 제어부',
    message: '튀김 온도 측정값 허용 범위 초과',
    description: '튀김기 FR-01의 유온 측정값이 허용 범위를 초과했습니다. 제품 품질 영향 가능성이 있어 즉시 조치가 필요했습니다.',
    severity: 'critical',
    severityLabel: '심각',
    occurredAt: '2026-07-09 17:41:19',
    clearedAt: '2026-07-09 17:48:50',
    handler: '정유진',
    status: '처리 완료',
    action: '유온 제어값 조정 후 샘플 품질 확인을 완료했습니다.',
  },
  'ALM-260709-012': {
    ...alarmDetail,
    id: 'ALM-260709-012',
    equipment: '제면기 NM-01',
    process: '제면 공정',
    location: '제면 공정 / 면대 공급 롤러',
    message: '면대 공급 시간 지연',
    description: '제면기 NM-01의 면대 공급 시간이 기준보다 길어졌습니다. 롤러 간격과 공급 모터 상태 확인이 필요했습니다.',
    severity: 'warning',
    severityLabel: '경고',
    occurredAt: '2026-07-09 16:52:05',
    clearedAt: '2026-07-09 16:59:28',
    handler: '라인 A',
    status: '처리 완료',
    action: '공급 롤러 간격 확인 후 정상 범위로 복귀했습니다.',
  },
  'ALM-260709-011': {
    ...alarmDetail,
    id: 'ALM-260709-011',
    equipment: '검사기 IN-01',
    process: '검사 공정',
    location: '검사 공정 / 조명 모듈',
    message: '비전 검사 조명 보정',
    description: '비전 검사 조명값이 자동 보정되었습니다. 생산 영향은 없으며 자동 처리 이력으로 관리됩니다.',
    severity: 'info',
    severityLabel: '정보',
    occurredAt: '2026-07-09 15:33:27',
    clearedAt: '2026-07-09 15:33:58',
    handler: '자동 처리',
    status: '처리 완료',
    action: '조명 보정값이 자동 적용되었고 검사 상태가 정상으로 복귀했습니다.',
  },
  'ALM-260709-010': {
    ...alarmDetail,
    id: 'ALM-260709-010',
    equipment: '검사기 IN-01',
    process: '검사 공정',
    location: '검사 공정 / 비전 조명',
    message: '비전 검사 조명 모듈 점검 예정',
    description: '검사기 IN-01의 조명 모듈 상태가 점검 대상으로 등록되었습니다. 즉시 생산 중단은 필요하지 않습니다.',
    severity: 'info',
    severityLabel: '정보',
    occurredAt: '2026-07-09 14:21:39',
    clearedAt: '-',
    handler: '미배정',
    status: '미처리',
    action: '조명 모듈 점검 작업을 다음 정비 시간에 배정합니다.',
  },
  'ALM-260709-008': {
    ...alarmDetail,
    id: 'ALM-260709-008',
    equipment: '배합기 MX-01',
    process: '배합 공정',
    location: '배합 공정 / 원료 투입부',
    message: '배합 원료 투입 시간 지연',
    description: '배합기 MX-01에서 원료 투입 시간이 기준보다 길어졌습니다. 투입 밸브와 공급 라인 상태를 확인합니다.',
    severity: 'info',
    severityLabel: '정보',
    occurredAt: '2026-07-09 12:17:09',
    clearedAt: '2026-07-09 12:22:41',
    handler: '자동 처리',
    status: '처리 완료',
    action: '원료 공급 라인 상태 확인 후 정상 흐름을 확인했습니다.',
  },
  'ALM-260708-044': {
    ...alarmDetail,
    id: 'ALM-260708-044',
    equipment: '배합기 MX-01',
    process: '배합 공정',
    location: '배합 공정 / 구동 모터',
    message: '배합 모터 부하율 기준치 근접',
    description: '배합기 MX-01 구동 모터 부하율이 관리 기준치에 근접했습니다. 반복 발생 여부를 추적합니다.',
    severity: 'warning',
    severityLabel: '경고',
    occurredAt: '2026-07-08 21:04:36',
    clearedAt: '2026-07-08 21:18:09',
    handler: '라인 A',
    status: '처리 완료',
    action: '구동 모터 부하 추세 확인 후 추가 이상이 없어 완료 처리했습니다.',
  },
};

const relatedRows = [
  {
    id: 'ALM-260709-013',
    occurredAt: '2026-07-09 17:41:19',
    equipment: '유탕기 FR-01',
    message: '유탕 온도 편차가 품질 허용 범위 초과',
    severity: 'critical',
    status: '처리 완료',
  },
  {
    id: 'ALM-260708-039',
    occurredAt: '2026-07-08 19:22:44',
    equipment: '증숙기 ST-01',
    message: '스팀 압력 하한 근접',
    severity: 'warning',
    status: '처리 완료',
  },
  {
    id: 'ALM-260707-021',
    occurredAt: '2026-07-07 11:08:02',
    equipment: '압연기 RL-01',
    message: '압연 롤러 간격 편차',
    severity: 'warning',
    status: '처리 완료',
  },
];


function AlarmDetailPage() {
  const { alarmId } = useParams();
  const [showEmpty, setShowEmpty] = useState(false);
  const navigate = useNavigate();
  const detail = showEmpty ? null : alarmDetails[alarmId] || null;
  const openDetail = (nextAlarmId) => navigate(`/alarm/detail/${nextAlarmId}`);

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>Alarm Detail</Eyebrow>
          <h1>알람 상세 정보</h1>
          <p>알람 번호, 설비 위치, 발생 및 해제 시간, 처리자와 조치 내용을 확인합니다.</p>
        </TitleBlock>
      </PageHeader>

      <StateSwitch aria-label="데이터 상태 미리보기">
        <SwitchButton type="button" $active={!showEmpty} onClick={() => setShowEmpty(false)}>
          데이터 있음
        </SwitchButton>
        <SwitchButton type="button" $active={showEmpty} onClick={() => setShowEmpty(true)}>
          데이터 없음
        </SwitchButton>
      </StateSwitch>

      {detail ? (
        <DetailLayout key={detail.id}>
          <HeroPanel $severity={detail.severity}>
            <HeroHeader>
              <div>
                <PanelLabel>Active Incident</PanelLabel>
                <h2>{detail.message}</h2>
              </div>
              <SeverityChip $severity={detail.severity}>{detail.severityLabel}</SeverityChip>
            </HeroHeader>
            <HeroDescription>{detail.description}</HeroDescription>
            <HeroMetaGrid>
              <MetaItem>
                <span>알람 번호</span>
                <MonoText>{detail.id}</MonoText>
              </MetaItem>
              <MetaItem>
                <span>처리 상태</span>
                <strong>{detail.status}</strong>
              </MetaItem>
              <MetaItem>
                <span>처리자</span>
                <strong>{detail.handler}</strong>
              </MetaItem>
            </HeroMetaGrid>
          </HeroPanel>

          <InfoPanel>
            <PanelLabel>Alarm Information</PanelLabel>
            <InfoGrid>
              <InfoItem>
                <FiTool />
                <div>
                  <dt>설비명</dt>
                  <dd>{detail.equipment}</dd>
                </div>
              </InfoItem>
              <InfoItem>
                <FiMapPin />
                <div>
                  <dt>발생 위치</dt>
                  <dd>{detail.location}</dd>
                </div>
              </InfoItem>
              <InfoItem>
                <FiClock />
                <div>
                  <dt>발생 시간</dt>
                  <dd>
                    <MonoText>{detail.occurredAt}</MonoText>
                  </dd>
                </div>
              </InfoItem>
              <InfoItem>
                <FiCheckCircle />
                <div>
                  <dt>해제 시간</dt>
                  <dd>{detail.clearedAt}</dd>
                </div>
              </InfoItem>
            </InfoGrid>
          </InfoPanel>

          <TimelinePanel>
            <PanelLabel>Response Timeline</PanelLabel>
            <h2>조치 타임라인</h2>
            <Timeline>
              <TimelineItem $active>
                <MonoText>18:35:03</MonoText>
                <strong>알람 발생</strong>
                <span>스팀 압력 상한 초과 감지</span>
              </TimelineItem>
              <TimelineItem $active>
                <MonoText>18:36:20</MonoText>
                <strong>담당자 지정</strong>
                <span>박현우 작업자에게 조치 배정</span>
              </TimelineItem>
              <TimelineItem>
                <MonoText>대기</MonoText>
                <strong>해제 확인</strong>
                <span>압력 안정화 및 품질 샘플링 후 해제 예정</span>
              </TimelineItem>
            </Timeline>
          </TimelinePanel>

          <ActionPanel>
            <PanelHeader>
              <div>
                <PanelLabel>Handling Note</PanelLabel>
                <h2>처리 내용</h2>
              </div>
              <StatusPill>{detail.status}</StatusPill>
            </PanelHeader>
            <FormGrid>
              <Field>
                <span>처리자</span>
                <input aria-label="처리자" defaultValue={detail.handler} />
              </Field>
              <Field>
                <span>처리 상태</span>
                <select aria-label="처리 상태" defaultValue="working">
                  <option value="pending">확인 대기</option>
                  <option value="working">조치 중</option>
                  <option value="done">처리 완료</option>
                </select>
              </Field>
              <TextAreaField>
                <span>처리 내용</span>
                <textarea aria-label="처리 내용" defaultValue={detail.action} />
              </TextAreaField>
            </FormGrid>
            <ButtonRow>
              <PrimaryButton type="button">
                <FiEdit3 />
                처리 내용 저장
              </PrimaryButton>
            </ButtonRow>
          </ActionPanel>

          <RelatedPanel>
            <PanelHeader>
              <div>
                <PanelLabel>Related Alarms</PanelLabel>
                <h2>관련 알람 이력</h2>
              </div>
              <PanelMeta>최근 72시간</PanelMeta>
            </PanelHeader>
            <TableFrame>
              <RelatedTable>
                <thead>
                  <tr>
                    <th>발생 시간</th>
                    <th>설비명</th>
                    <th>알람 내용</th>
                    <th>심각도</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedRows.map((row) => (
                    <tr
                      key={row.id}
                      className="alarm-clickable-row"
                      tabIndex={0}
                      onClick={() => openDetail(row.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openDetail(row.id);
                        }
                      }}
                    >
                      <td>
                        <TimeCell>
                          <MonoText>{row.occurredAt}</MonoText>
                          <MonoText>{row.id}</MonoText>
                        </TimeCell>
                      </td>
                      <td>{row.equipment}</td>
                      <td>{row.message}</td>
                      <td>
                        <SeverityChip $severity={row.severity}>
                          {row.severity === 'critical' ? '심각' : '경고'}
                        </SeverityChip>
                      </td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </RelatedTable>
            </TableFrame>
          </RelatedPanel>
        </DetailLayout>
      ) : (
        <EmptyState>
          <FiCheckCircle />
          <strong>선택된 알람 상세 정보가 없습니다.</strong>
          <span>알람 목록에서 항목을 선택하면 알람 번호, 발생 위치, 처리 내용이 이곳에 표시됩니다.</span>
        </EmptyState>
      )}
    </PageShell>
  );
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function withClass(Tag, baseClass) {
  return function ClassComponent({ className, ...props }) {
    return <Tag className={cx(baseClass, className)} {...props} />;
  };
}

const PageShell = withClass('main', 'alarm-detail-page');
const PageHeader = withClass('section', 'alarm-page-header');
const TitleBlock = withClass('div', 'alarm-title-block');
const Eyebrow = withClass('span', 'alarm-eyebrow');
const StateSwitch = withClass('div', 'alarm-state-switch');
const DetailLayout = withClass('section', 'alarm-detail-layout');
const HeroHeader = withClass('div', 'alarm-hero-header');
const HeroDescription = withClass('p', 'alarm-hero-description');
const HeroMetaGrid = withClass('div', 'alarm-hero-meta-grid');
const MetaItem = withClass('div', 'alarm-meta-item');
const InfoPanel = withClass('article', 'alarm-info-panel');
const InfoGrid = withClass('dl', 'alarm-info-grid');
const InfoItem = withClass('div', 'alarm-info-item');
const TimelinePanel = withClass('article', 'alarm-timeline-panel');
const Timeline = withClass('div', 'alarm-timeline');
const ActionPanel = withClass('article', 'alarm-action-panel');
const RelatedPanel = withClass('article', 'alarm-action-panel alarm-related-panel');
const PanelHeader = withClass('div', 'alarm-panel-header');
const PanelLabel = withClass('span', 'alarm-panel-label');
const PanelMeta = withClass('span', 'alarm-panel-meta');
const FormGrid = withClass('div', 'alarm-form-grid');
const Field = withClass('label', 'alarm-form-field');
const TextAreaField = withClass('label', 'alarm-form-field alarm-textarea-field');
const ButtonRow = withClass('div', 'alarm-button-row');
const PrimaryButton = withClass('button', 'alarm-button alarm-button--primary');
const TableFrame = withClass('div', 'alarm-table-frame');
const RelatedTable = withClass('table', 'alarm-table');
const TimeCell = withClass('div', 'alarm-time-cell');
const MonoText = withClass('span', 'alarm-mono');
const StatusPill = withClass('span', 'alarm-status-pill alarm-status-pill--warning');
const EmptyState = withClass('div', 'alarm-empty-state');

const SwitchButton = ({ $active, className, ...props }) => (
  <button className={cx('alarm-state-switch__button', $active && 'is-active', className)} {...props} />
);

const HeroPanel = ({ $severity, className, ...props }) => (
  <article className={cx('alarm-hero-panel', $severity && `alarm-hero-panel--${$severity}`, className)} {...props} />
);

const TimelineItem = ({ $active, className, ...props }) => (
  <div className={cx('alarm-timeline-item', $active && 'is-active', className)} {...props} />
);

const SeverityChip = ({ $severity, className, ...props }) => (
  <span className={cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className)} {...props} />
);
export default AlarmDetailPage;
