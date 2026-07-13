import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AlarmHistoryPage.css';
import {
  FiCalendar,
  FiFileText,
  FiFilter,
  FiSearch,
  FiX,
} from 'react-icons/fi';

const alarmHistoryRows = [
  {
    id: 'ALM-260709-014',
    occurredAt: '2026-07-09 17:58:44',
    clearedAt: '2026-07-09 18:06:12',
    equipment: '포장기 PK-01',
    type: '포장 씰링 온도',
    severity: 'warning',
    severityLabel: '경고',
    handled: true,
    handler: '김민재',
    result: '히터 제어값 재보정 후 정상 범위 복귀',
  },
  {
    id: 'ALM-260709-013',
    occurredAt: '2026-07-09 17:41:19',
    clearedAt: '2026-07-09 17:48:50',
    equipment: '유탕기 FR-01',
    type: '유탕 온도 편차',
    severity: 'critical',
    severityLabel: '심각',
    handled: true,
    handler: '정유진',
    result: '유온 제어값 조정 및 제품 품질 샘플링 완료',
  },
  {
    id: 'ALM-260709-012',
    occurredAt: '2026-07-09 16:52:05',
    clearedAt: '2026-07-09 16:59:28',
    equipment: '제면기 NM-01',
    type: '면대 공급량 편차',
    severity: 'warning',
    severityLabel: '경고',
    handled: true,
    handler: '라인 A',
    result: '면대 공급 롤러 간격 확인 후 공급량 정상화',
  },
  {
    id: 'ALM-260709-011',
    occurredAt: '2026-07-09 15:33:27',
    clearedAt: '2026-07-09 15:33:58',
    equipment: '성형/절단기 CT-01',
    type: '절단 위치 보정',
    severity: 'info',
    severityLabel: '정보',
    handled: true,
    handler: '자동 처리',
    result: '일시 위치 보정 지연 후 자동 복귀',
  },
  {
    id: 'ALM-260709-010',
    occurredAt: '2026-07-09 14:21:39',
    clearedAt: '-',
    equipment: '검사기 IN-01',
    type: '비전 검사 조명',
    severity: 'info',
    severityLabel: '정보',
    handled: false,
    handler: '미배정',
    result: '조명 모듈 점검 예정 작업으로 등록됨',
  },
];


function AlarmHistoryPage() {
  const [showEmpty, setShowEmpty] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const navigate = useNavigate();

  const alarms = useMemo(() => (showEmpty ? [] : alarmHistoryRows), [showEmpty]);
  const handledCount = alarms.filter((alarm) => alarm.handled).length;
  const pendingCount = alarms.length - handledCount;
  const openDetail = (alarmId) => navigate(`/alarm/detail/${alarmId}`);

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>Alarm Archive</Eyebrow>
          <h1>알람 이력 목록</h1>
          <p>전체 알람 발생 이력, 해제 시간, 처리 여부를 기준으로 설비 이상 흐름을 추적합니다.</p>
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

      <SummaryGrid>
        <SummaryCard>
          <span>조회 알람</span>
          <strong>{alarms.length}</strong>
          <small>선택 기간 내 발생 건수</small>
        </SummaryCard>
        <SummaryCard>
          <span>처리 완료</span>
          <strong>{handledCount}</strong>
          <small>해제 및 처리 내용 등록</small>
        </SummaryCard>
        <SummaryCard>
          <span>미처리</span>
          <strong>{pendingCount}</strong>
          <small>담당자 배정 또는 확인 필요</small>
        </SummaryCard>
      </SummaryGrid>

      <FilterPanel>
        <FilterField>
          <FiCalendar />
          <input type="date" aria-label="시작 일자" defaultValue="2026-07-09" />
        </FilterField>
        <FilterField>
          <FiCalendar />
          <input type="date" aria-label="종료 일자" defaultValue="2026-07-09" />
        </FilterField>
        <FilterField>
          <FiSearch />
          <input aria-label="알람 이력 검색" placeholder="알람 번호, 설비명, 유형 검색" />
        </FilterField>
        <SelectField>
          <FiFilter />
          <select aria-label="처리 여부 필터" defaultValue="all">
            <option value="all">전체 처리 여부</option>
            <option value="handled">처리 완료</option>
            <option value="pending">미처리</option>
          </select>
        </SelectField>
        <SelectField>
          <select aria-label="심각도 필터" defaultValue="all">
            <option value="all">전체 심각도</option>
            <option value="critical">심각</option>
            <option value="warning">경고</option>
            <option value="info">정보</option>
          </select>
        </SelectField>
      </FilterPanel>

      <Panel>
        <PanelHeader>
          <div>
            <PanelLabel>History Table</PanelLabel>
            <h2>전체 알람 발생 이력</h2>
          </div>
          <PanelMeta>총 {alarms.length}건</PanelMeta>
        </PanelHeader>

        {alarms.length > 0 ? (
          <TableFrame>
            <HistoryTable>
              <thead>
                <tr>
                  <th>발생 일시</th>
                  <th>설비명</th>
                  <th>알람 유형</th>
                  <th>심각도</th>
                  <th>해제 시간</th>
                  <th>처리 여부</th>
                  <th>처리 내용</th>
                </tr>
              </thead>
              <tbody>
                {alarms.map((alarm) => (
                  <tr
                    key={alarm.id}
                    className="alarm-clickable-row"
                    tabIndex={0}
                    onClick={() => openDetail(alarm.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openDetail(alarm.id);
                      }
                    }}
                  >
                    <td>
                      <TimeCell>
                        <MonoText>{alarm.occurredAt}</MonoText>
                        <MonoText>{alarm.id}</MonoText>
                      </TimeCell>
                    </td>
                    <td>{alarm.equipment}</td>
                    <td>{alarm.type}</td>
                    <td>
                      <SeverityChip $severity={alarm.severity}>{alarm.severityLabel}</SeverityChip>
                    </td>
                    <td>
                      <MonoText>{alarm.clearedAt}</MonoText>
                    </td>
                    <td>
                      <StatusChip $handled={alarm.handled}>{alarm.handled ? '처리 완료' : '미처리'}</StatusChip>
                    </td>
                    <td>
                      <TextButton
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedAlarm(alarm);
                        }}
                      >
                        <FiFileText />
                        메모 보기
                      </TextButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </HistoryTable>
          </TableFrame>
        ) : (
          <EmptyState>
            <FiFileText />
            <strong>조회된 알람 이력이 없습니다.</strong>
            <span>기간, 설비명, 심각도 조건을 변경하면 해당 조건의 발생 이력이 이곳에 표시됩니다.</span>
          </EmptyState>
        )}
      </Panel>

      {selectedAlarm && (
        <ModalBackdrop role="presentation">
          <Modal role="dialog" aria-modal="true" aria-labelledby="alarm-history-modal-title">
            <ModalHeader>
              <div>
                <PanelLabel>Resolve Note</PanelLabel>
                <h2 id="alarm-history-modal-title">처리 내용</h2>
              </div>
              <IconButton type="button" aria-label="모달 닫기" onClick={() => setSelectedAlarm(null)}>
                <FiX />
              </IconButton>
            </ModalHeader>
            <ModalBody>
              <DetailGrid>
                <dt>알람 번호</dt>
                <dd>
                  <MonoText>{selectedAlarm.id}</MonoText>
                </dd>
                <dt>설비명</dt>
                <dd>{selectedAlarm.equipment}</dd>
                <dt>알람 유형</dt>
                <dd>{selectedAlarm.type}</dd>
                <dt>처리자</dt>
                <dd>{selectedAlarm.handler}</dd>
              </DetailGrid>
              <NoteBox>{selectedAlarm.result}</NoteBox>
            </ModalBody>
          </Modal>
        </ModalBackdrop>
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

const PageShell = withClass('main', 'alarm-history-page');
const PageHeader = withClass('section', 'alarm-page-header');
const TitleBlock = withClass('div', 'alarm-title-block');
const Eyebrow = withClass('span', 'alarm-eyebrow');
const StateSwitch = withClass('div', 'alarm-state-switch');
const SummaryGrid = withClass('section', 'alarm-summary-grid');
const SummaryCard = withClass('article', 'alarm-summary-card');
const FilterPanel = withClass('section', 'alarm-history-filter-panel');
const FilterField = withClass('label', 'alarm-field');
const SelectField = withClass('label', 'alarm-field');
const Panel = withClass('article', 'alarm-panel');
const PanelHeader = withClass('div', 'alarm-panel-header');
const PanelLabel = withClass('span', 'alarm-panel-label');
const PanelMeta = withClass('span', 'alarm-panel-meta');
const TableFrame = withClass('div', 'alarm-table-frame');
const HistoryTable = withClass('table', 'alarm-table');
const TimeCell = withClass('div', 'alarm-time-cell');
const MonoText = withClass('span', 'alarm-mono');
const TextButton = withClass('button', 'alarm-text-button');
const EmptyState = withClass('div', 'alarm-empty-state');
const ModalBackdrop = withClass('div', 'alarm-modal-backdrop');
const Modal = withClass('div', 'alarm-modal');
const ModalHeader = withClass('div', 'alarm-modal-header');
const IconButton = withClass('button', 'alarm-icon-button');
const ModalBody = withClass('div', 'alarm-modal-body');
const DetailGrid = withClass('dl', 'alarm-detail-grid');
const NoteBox = withClass('div', 'alarm-note-box');

const SwitchButton = ({ $active, className, ...props }) => (
  <button className={cx('alarm-state-switch__button', $active && 'is-active', className)} {...props} />
);

const SeverityChip = ({ $severity, className, ...props }) => (
  <span className={cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className)} {...props} />
);

const StatusChip = ({ $handled, className, ...props }) => (
  <span className={cx('alarm-status-chip', $handled ? 'is-handled' : 'is-pending', className)} {...props} />
);
export default AlarmHistoryPage;
