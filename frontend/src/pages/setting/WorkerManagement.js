import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { referenceApi, usersApi, workerApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import {
  Badge,
  Button,
  Card,
  FormGrid,
  Grid,
  Header,
  Input,
  Page,
  Select,
  pageContent,
} from "../../components/OperationalUi";
import useDebouncedValue from "../../hooks/useDebouncedValue";

const emptyEditor = { workerProfileId: null, userId: "", teamName: "", shiftType: "DAY", joinedDate: "", primaryProcessId: "", skills: "" };

export default function WorkerManagement() {
  const queryClient = useQueryClient();
  const [keywordDraft, setKeywordDraft] = useState("");
  const keyword = useDebouncedValue(keywordDraft.trim());
  const [editor, setEditor] = useState(null);
  const [message, setMessage] = useState("");
  const params = { keyword: keyword || undefined, page: 0, size: 100 };
  const workersQuery = useQuery({ queryKey: queryKeys.workers(params), queryFn: () => workerApi.list(params), placeholderData: (previous) => previous });
  const usersQuery = useQuery({ queryKey: queryKeys.users({ role: "OPERATOR", size: 100 }), queryFn: () => usersApi.list({ role: "OPERATOR", size: 100 }) });
  const processesQuery = useQuery({ queryKey: queryKeys.processes(), queryFn: referenceApi.processes });
  const workers = pageContent(workersQuery.data);
  const usedUserIds = useMemo(() => new Set(workers.map((worker) => worker.userId)), [workers]);
  const eligibleUsers = pageContent(usersQuery.data).filter((entry) => entry.active && entry.approvalStatus === "APPROVED" && (!usedUserIds.has(entry.userId) || entry.userId === editor?.userId));
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["workers"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };
  const saveMutation = useMutation({
    mutationFn: async ({ values, originalSkills }) => {
      const body = {
        userId: Number(values.userId),
        teamName: values.teamName,
        shiftType: values.shiftType,
        joinedDate: values.joinedDate,
        primaryProcessId: Number(values.primaryProcessId),
      };
      const profile = values.workerProfileId
        ? await workerApi.update(values.workerProfileId, body)
        : await workerApi.create(body);
      const nextSkills = new Set(values.skills.split(",").map((value) => value.trim()).filter(Boolean));
      const previousSkills = new Set(originalSkills || []);
      await Promise.all([
        ...[...nextSkills].filter((skill) => !previousSkills.has(skill)).map((skill) => workerApi.addSkill(profile.workerProfileId, { skillName: skill })),
        ...[...previousSkills].filter((skill) => !nextSkills.has(skill)).map((skill) => workerApi.removeSkill(profile.workerProfileId, skill)),
      ]);
      return profile;
    },
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({ mutationFn: workerApi.remove, onSuccess: invalidate });

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await saveMutation.mutateAsync({ values: editor, originalSkills: editor.originalSkills });
      setEditor(null);
      setMessage("작업자 프로필과 기술을 저장했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  return (
    <Page>
      <Header><div><h1>작업자 관리</h1><p>근태를 추정하지 않고 팀·교대조·주 담당 공정과 기술을 관리합니다.</p></div><Button onClick={() => setEditor(emptyEditor)}>프로필 등록</Button></Header>
      <Input value={keywordDraft} onChange={(event) => setKeywordDraft(event.target.value)} placeholder="작업자 검색" />
      {message && <p role="status">{message}</p>}
      <ApiErrors queries={[usersQuery, processesQuery]} />
      {editor && <Card style={{ marginTop: 18 }}>
        <h2>{editor.workerProfileId ? "프로필 수정" : "프로필 등록"}</h2>
        <FormGrid onSubmit={handleSave}>
          <label>활성 작업자<Select value={editor.userId} disabled={Boolean(editor.workerProfileId)} onChange={(event) => setEditor({ ...editor, userId: event.target.value })} required>
            <option value="">사용자 선택</option>{eligibleUsers.map((entry) => <option key={entry.userId} value={entry.userId}>{entry.name} ({entry.empNo})</option>)}
          </Select></label>
          <label>팀<input value={editor.teamName} onChange={(event) => setEditor({ ...editor, teamName: event.target.value })} required /></label>
          <label>교대조<Select value={editor.shiftType} onChange={(event) => setEditor({ ...editor, shiftType: event.target.value })}><option value="DAY">주간조</option><option value="NIGHT">야간조</option><option value="ROTATING">교대조</option></Select></label>
          <label>입사일<input type="date" value={editor.joinedDate} onChange={(event) => setEditor({ ...editor, joinedDate: event.target.value })} required /></label>
          <label>주 담당 공정<Select value={editor.primaryProcessId} onChange={(event) => setEditor({ ...editor, primaryProcessId: event.target.value })} required><option value="">공정 선택</option>{(processesQuery.data || []).map((process) => <option key={process.processId} value={process.processId}>{process.processName}</option>)}</Select></label>
          <label>기술(쉼표 구분)<input value={editor.skills} onChange={(event) => setEditor({ ...editor, skills: event.target.value })} /></label>
          <div><Button disabled={saveMutation.isPending}>{saveMutation.isPending ? "저장 중..." : "저장"}</Button> <Button type="button" $secondary onClick={() => setEditor(null)}>취소</Button></div>
        </FormGrid>
      </Card>}
      <QueryStatus query={workersQuery} empty={workers.length === 0} />
      <Grid style={{ marginTop: 20 }}>
        {workers.map((worker) => <Card key={worker.workerProfileId}>
          <h2>{worker.name}</h2><p>{worker.empNo}</p>
          <p><strong>{worker.teamName}</strong> · {worker.shiftTypeLabel}</p>
          <p>주 담당 공정: {worker.primaryProcessName}</p>
          <p>{worker.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</p>
          <Button $secondary onClick={() => setEditor({ ...worker, skills: worker.skills.join(", "), originalSkills: worker.skills })}>수정</Button>{" "}
          <Button $secondary disabled={removeMutation.isPending} onClick={() => window.confirm("프로필을 삭제하시겠습니까?") && removeMutation.mutate(worker.workerProfileId)}>삭제</Button>
        </Card>)}
      </Grid>
    </Page>
  );
}
