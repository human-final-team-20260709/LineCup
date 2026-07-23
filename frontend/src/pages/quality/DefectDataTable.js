import { useNavigate } from "react-router-dom";
import { toKst } from "../../api/time";
import { Badge, Table, TableWrap, toneForStatus } from "../../components/OperationalUi";

export default function DefectDataTable({ defects = [] }) {
  const navigate = useNavigate();
  return <TableWrap><Table>
    <thead><tr><th>불량</th><th>제품/LOT</th><th>설비·공정</th><th>유형</th><th>수량</th><th>상태</th><th>발생 시각</th></tr></thead>
    <tbody>{defects.map((defect) => <tr key={defect.defectId} onClick={() => navigate(`/quality/defects/${defect.defectId}`)} style={{ cursor: "pointer" }}>
      <td>{defect.defectNo}<br />{defect.workOrderNo}</td><td>{defect.productName}<br />{defect.lotNo}</td><td>{defect.equipmentCode} {defect.equipmentName}<br />{defect.processName}</td><td>{defect.defectTypeLabel}</td><td>{defect.quantity}</td><td><Badge $tone={toneForStatus(defect.status)}>{defect.statusLabel}</Badge></td><td>{toKst(defect.occurredAt)}</td>
    </tr>)}</tbody>
  </Table></TableWrap>;
}
