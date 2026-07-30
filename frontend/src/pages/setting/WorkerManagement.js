import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FiCpu,
  FiEdit2,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import styled from "styled-components";
import { referenceApi, usersApi, workerApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
import {
  Button,
  FormGrid,
  Grid,
  Header,
  Input,
  ModalBackdrop,
  ModalPanel,
  Page,
  Select,
  pageContent,
} from "../../components/OperationalUi";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import {
  ActionButton,
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  Identity,
  InfoItem,
  InfoLabel,
  InfoValue,
  Skill,
  SkillList,
  StatusChip,
  WorkerAvatar,
  WorkerCard,
} from "./WorkerManagementCss";

const PAGE_SIZE = 12;

const WorkerGrid = styled(Grid)`
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const toneForShift = (shiftType) => {
  if (shiftType === "NIGHT") return "warning";
  if (shiftType === "ROTATING") return "neutral";
  return "success";
};

const emptyEditor = {
  workerProfileId: null,
  userId: "",
  teamName: "",
  shiftType: "DAY",
  joinedDate: "",
  primaryProcessId: "",
  skills: "",
};

export default function WorkerManagement() {
  const queryClient = useQueryClient();
  const [keywordDraft, setKeywordDraft] = useState("");
  const keyword = useDebouncedValue(keywordDraft.trim());
  const [page, setPage] = useState(0);
  const [editor, setEditor] = useState(null);
  const [message, setMessage] = useState("");
  const params = { keyword: keyword || undefined, page, size: PAGE_SIZE };
  const workersQuery = useQuery({
    queryKey: queryKeys.workers(params),
    queryFn: () => workerApi.list(params),
    placeholderData: (previous) => previous,
  });
  const allWorkersQuery = useQuery({
    queryKey: queryKeys.workers({ page: 0, size: 100 }),
    queryFn: () => workerApi.list({ page: 0, size: 100 }),
  });
  const usersQuery = useQuery({
    queryKey: queryKeys.users({ role: "OPERATOR", size: 100 }),
    queryFn: () => usersApi.list({ role: "OPERATOR", size: 100 }),
  });
  const processesQuery = useQuery({
    queryKey: queryKeys.processes(),
    queryFn: referenceApi.processes,
  });
  useEffect(() => {
    const lastPage = Math.max(1, workersQuery.data?.totalPages ?? 1);
    setPage((currentPage) => Math.min(currentPage, lastPage - 1));
  }, [workersQuery.data?.totalPages]);
  const workers = pageContent(workersQuery.data);
  const allWorkers = pageContent(allWorkersQuery.data);
  const usedUserIds = useMemo(
    () => new Set(allWorkers.map((worker) => worker.userId)),
    [allWorkers],
  );
  const eligibleUsers = pageContent(usersQuery.data).filter(
    (entry) =>
      entry.active &&
      entry.approvalStatus === "approved" &&
      (!usedUserIds.has(entry.userId) || entry.userId === editor?.userId),
  );
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
      const nextSkills = new Set(
        values.skills
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      );
      const previousSkills = new Set(originalSkills || []);
      await Promise.all([
        ...[...nextSkills]
          .filter((skill) => !previousSkills.has(skill))
          .map((skill) =>
            workerApi.addSkill(profile.workerProfileId, { skillName: skill }),
          ),
        ...[...previousSkills]
          .filter((skill) => !nextSkills.has(skill))
          .map((skill) =>
            workerApi.removeSkill(profile.workerProfileId, skill),
          ),
      ]);
      return profile;
    },
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: workerApi.remove,
    onSuccess: invalidate,
  });

  useEffect(() => {
    if (!editor) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setEditor(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [editor]);

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await saveMutation.mutateAsync({
        values: editor,
        originalSkills: editor.originalSkills,
      });
      setEditor(null);
      setMessage("작업자 프로필과 기술을 저장했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  return (
    <Page>
      <Header>
        <div>
          <h1>작업자 관리</h1>
          <p>
            근태를 추정하지 않고 팀·교대조·주 담당 공정과 기술을 관리합니다.
          </p>
        </div>
        <Button onClick={() => setEditor(emptyEditor)}>프로필 등록</Button>
      </Header>
      <Input
        value={keywordDraft}
        onChange={(event) => {
          setKeywordDraft(event.target.value);
          setPage(0);
        }}
        placeholder="작업자 검색"
      />
      {message && <p role="status">{message}</p>}
      <ApiErrors queries={[usersQuery, processesQuery, allWorkersQuery]} />
      {editor && (
        <ModalBackdrop onClick={() => setEditor(null)}>
          <ModalPanel
            role="dialog"
            aria-modal="true"
            aria-labelledby="worker-profile-editor-title"
            onClick={(event) => event.stopPropagation()}
          >
          <h2 id="worker-profile-editor-title">
            {editor.workerProfileId ? "프로필 수정" : "프로필 등록"}
          </h2>
          <FormGrid onSubmit={handleSave}>
            <label>
              활성 작업자
              <Select
                value={editor.userId}
                disabled={Boolean(editor.workerProfileId)}
                onChange={(event) =>
                  setEditor({ ...editor, userId: event.target.value })
                }
                required
              >
                <option value="">사용자 선택</option>
                {eligibleUsers.map((entry) => (
                  <option key={entry.userId} value={entry.userId}>
                    {entry.name} ({entry.empNo})
                  </option>
                ))}
              </Select>
            </label>
            <label>
              팀
              <input
                value={editor.teamName}
                onChange={(event) =>
                  setEditor({ ...editor, teamName: event.target.value })
                }
                required
              />
            </label>
            <label>
              교대조
              <Select
                value={editor.shiftType}
                onChange={(event) =>
                  setEditor({ ...editor, shiftType: event.target.value })
                }
              >
                <option value="DAY">주간조</option>
                <option value="NIGHT">야간조</option>
                <option value="ROTATING">교대조</option>
              </Select>
            </label>
            <label>
              입사일
              <input
                type="date"
                value={editor.joinedDate}
                onChange={(event) =>
                  setEditor({ ...editor, joinedDate: event.target.value })
                }
                required
              />
            </label>
            <label>
              주 담당 공정
              <Select
                value={editor.primaryProcessId}
                onChange={(event) =>
                  setEditor({ ...editor, primaryProcessId: event.target.value })
                }
                required
              >
                <option value="">공정 선택</option>
                {(processesQuery.data || []).map((process) => (
                  <option key={process.processId} value={process.processId}>
                    {process.processName}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              기술(쉼표 구분)
              <input
                value={editor.skills}
                onChange={(event) =>
                  setEditor({ ...editor, skills: event.target.value })
                }
              />
            </label>
            <div>
              <Button disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "저장 중..." : "저장"}
              </Button>{" "}
              <Button type="button" $secondary onClick={() => setEditor(null)}>
                취소
              </Button>
            </div>
          </FormGrid>
          </ModalPanel>
        </ModalBackdrop>
      )}
      <QueryStatus query={workersQuery} empty={workers.length === 0} />
      <WorkerGrid>
        {workers.map((worker) => (
          <WorkerCard key={worker.workerProfileId} $tone="primary">
            <CardHeader>
              <WorkerAvatar aria-hidden="true">
                {worker.name?.slice(0, 1) || "W"}
              </WorkerAvatar>
              <Identity>
                <strong>{worker.name}</strong>
                <span>{worker.empNo}</span>
              </Identity>
              <StatusChip $tone={toneForShift(worker.shiftType)}>
                {worker.shiftTypeLabel}
              </StatusChip>
            </CardHeader>

            <CardBody>
              <InfoItem>
                <FiUsers aria-hidden="true" />
                <div>
                  <InfoLabel>소속 팀</InfoLabel>
                  <InfoValue>{worker.teamName || "-"}</InfoValue>
                </div>
              </InfoItem>
              <InfoItem>
                <FiCpu aria-hidden="true" />
                <div>
                  <InfoLabel>주 담당 공정</InfoLabel>
                  <InfoValue>{worker.primaryProcessName || "-"}</InfoValue>
                </div>
              </InfoItem>
              <div>
                <InfoLabel>보유 기술</InfoLabel>
                <SkillList>
                  {worker.skills.length > 0 ? (
                    worker.skills.map((skill) => (
                      <Skill key={skill}>{skill}</Skill>
                    ))
                  ) : (
                    <Skill>등록된 기술 없음</Skill>
                  )}
                </SkillList>
              </div>
            </CardBody>

            <CardFooter>
              <div>
                <InfoLabel>등록 기술</InfoLabel>
                <InfoValue $mono>{worker.skills.length}개</InfoValue>
              </div>
              <CardActions>
                <ActionButton
                  type="button"
                  aria-label={`${worker.name} 프로필 수정`}
                  title="프로필 수정"
                  onClick={() =>
                    setEditor({
                      ...worker,
                      skills: worker.skills.join(", "),
                      originalSkills: worker.skills,
                    })
                  }
                >
                  <FiEdit2 aria-hidden="true" />
                </ActionButton>
                <ActionButton
                  type="button"
                  $danger
                  aria-label={`${worker.name} 프로필 삭제`}
                  title="프로필 삭제"
                  disabled={removeMutation.isPending}
                  onClick={() =>
                    window.confirm("프로필을 삭제하시겠습니까?") &&
                    removeMutation.mutate(worker.workerProfileId)
                  }
                >
                  <FiTrash2 aria-hidden="true" />
                </ActionButton>
              </CardActions>
            </CardFooter>
          </WorkerCard>
        ))}
      </WorkerGrid>
      {(workersQuery.data?.totalElements ?? workers.length) > 0 && (
        <CommonPagination
          ariaLabel="작업자 관리 페이지 이동"
          currentPage={page + 1}
          onPageChange={(nextPage) => setPage(nextPage - 1)}
          pageSize={PAGE_SIZE}
          totalItems={workersQuery.data?.totalElements ?? workers.length}
          totalPages={Math.max(1, workersQuery.data?.totalPages ?? 1)}
        />
      )}
    </Page>
  );
}
