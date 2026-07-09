import { useState } from 'react';
import './AlarmDetailPage.css';
import {
  FiAlertTriangle,
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
  const [showEmpty, setShowEmpty] = useState(false);
  const detail = showEmpty ? null : alarmDetail;

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
        <DetailLayout>
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
              <GhostButton type="button">
                <FiAlertTriangle />
                작업지시 연결
              </GhostButton>
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
                    <tr key={row.id}>
                      <td>
                        <TimeCell>
                          <MonoText>{row.occurredAt}</MonoText>
                          <span>{row.id}</span>
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
const GhostButton = withClass('button', 'alarm-button alarm-button--ghost');
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
