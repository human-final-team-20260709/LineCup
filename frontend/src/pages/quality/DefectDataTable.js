import { useNavigate } from "react-router-dom";
import { toKst } from "../../api/time";
import { formatNumber } from "../../components/OperationalUi";

const cellValue = (value) => value || "-";
const toneForDefectStatus = (status) => {
  if (status === "UNHANDLED") {
    return "danger";
  }
  if (status === "COMPLETED") {
    return "success";
  }
  return "warn";
};

export default function DefectDataTable({ components, defects = [] }) {
  const navigate = useNavigate();
  const {
    Mono,
    StatusChip,
    Table,
    TableWrap,
  } = components;

  const openDetail = (defectId) => {
    navigate(`/quality/defects/${defectId}`);
  };

  const handleRowKeyDown = (event, defectId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetail(defectId);
    }
  };

  return (
    <TableWrap
      aria-label="불량 데이터 표"
      role="region"
      tabIndex={0}
    >
      <Table>
        <thead>
          <tr>
            <th scope="col">발생 일시</th>
            <th scope="col">제품명</th>
            <th scope="col">작업지시 번호</th>
            <th scope="col">생산 LOT 번호</th>
            <th scope="col">발생 공정</th>
            <th scope="col">불량 유형</th>
            <th scope="col">불량 수량</th>
            <th scope="col">처리 상태</th>
          </tr>
        </thead>
        <tbody>
          {defects.map((defect) => (
            <tr
              key={defect.defectId}
              aria-label={`${cellValue(defect.productName)} ${cellValue(defect.defectTypeLabel)} 상세 보기`}
              tabIndex={0}
              onClick={() => openDetail(defect.defectId)}
              onKeyDown={(event) => handleRowKeyDown(event, defect.defectId)}
            >
              <td data-label="발생 일시">
                <Mono>{cellValue(toKst(defect.occurredAt))}</Mono>
              </td>
              <td data-label="제품명">
                <strong>{cellValue(defect.productName)}</strong>
              </td>
              <td data-label="작업지시 번호">
                <Mono>{cellValue(defect.workOrderNo)}</Mono>
              </td>
              <td data-label="생산 LOT 번호">
                <Mono>{cellValue(defect.lotNo)}</Mono>
              </td>
              <td data-label="발생 공정">
                {cellValue(defect.processName)}
              </td>
              <td data-label="불량 유형">
                {cellValue(defect.defectTypeLabel)}
              </td>
              <td data-label="불량 수량">
                <Mono>{formatNumber(defect.quantity)} EA</Mono>
              </td>
              <td data-label="처리 상태">
                <StatusChip $tone={toneForDefectStatus(defect.status)}>
                  {cellValue(defect.statusLabel)}
                </StatusChip>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrap>
  );
}
