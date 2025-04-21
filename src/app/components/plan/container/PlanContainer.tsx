"use client";

import { useState } from "react";
import { ResizableBox } from "react-resizable";
import styled from "styled-components";
import "react-resizable/css/styles.css";
import { format } from "date-fns";
import { planComplete } from "../tools/common/PlanComplete";
import { useAtom } from "jotai";
import {
  containerUpdateState,
  detailState,
  isPlanPopupOpenState,
  planDeadlineState,
  planDifficultyState,
  planETCState,
  planIdState,
  planPenaltyState,
  planPopupTypeState,
  planProceduresState,
  planRangesState,
  planRewardState,
  planStartTimeState,
  planSuppliesState,
  planTargetState,
  planTextState,
  planTitleState,
  planTypeState,
  updateState,
} from "@/atoms/plan_popup/PlanPopupState";
import { planSectionComplete } from "../tools/plan_container/PlanSectionComplete";
import { removePlan } from "../tools/plan_container/RemovePlan";
import { partialUpdatePlan } from "../tools/plan_container/PartialUpdatePlan";
import { useAlarm } from "@/app/tools/alarmFunction/AlarmProvider";
import { useAlert } from "@/app/tools/alertFunction/AlertProvider";
import { togglePlan } from "../tools/plan_container/TogglePlan";
import dayjs from "dayjs";

const ResizableDiv = styled(ResizableBox)`
  position: absolute;
  top: 0;
  right: 0;

  background-color: white;

  height: 100%;

  border-left: 2px solid black;

  transition: width 0.2s ease-in-out;

  .react-resizable-handle {
    cursor: ew-resize;

    transform: rotate(0deg);

    width: 1px;
    height: 100%;

    top: 10px;
  }
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;

  margin: 30px;
`;

const DetailChecked = styled.button<{ completed: string }>`
  background-color: ${({ completed }) =>
    completed === "true" ? "black" : "rgba(0, 0, 0, 0)"};

  border: 2px solid black;
  border-radius: 5px;

  width: 40px;
  height: 40px;

  margin-right: 20px;
`;

const DetailTitle = styled.p`
  font-size: 30pt;
`;

const DetailExit = styled.button`
  position: absolute;
  right: 20px;

  background-color: rgba(0, 0, 0, 0);

  width: 30px;
  height: 30px;

  border: 1px solid black;
  border-radius: 5px;
`;

const DetailRemove = styled.button`
  position: absolute;
  right: 55px;

  background-color: rgba(255, 0, 0, 1);

  width: 30px;
  height: 30px;

  border: 1px solid black;
  border-radius: 5px;
`;

const DetailEdit = styled.button`
  position: absolute;
  right: 90px;

  background-color: yellow;

  width: 30px;
  height: 30px;

  border: 1px solid black;
  border-radius: 5px;
`;

// Description

const DescriptionContainer = styled.div`
  margin: 30px;
  margin-bottom: 50px;

  display: flex;
  align-items: center;
`;

const DescriptionLine = styled.div`
  background-color: black;
  width: 1px;
  height: 30px;

  margin-right: 10px;
`;

const Description = styled.p`
  display: flex;

  font-size: 18pt;

  margin-right: 10px;
`;

const PartialCompletedDescription = styled.input`
  width: 80px;
`;

const PartialCompletedDescriptionButton = styled.button``;

const CompletedSectionButton = styled.button``;

const SectionInfoButton = styled.button``;

// TaskAttributes

const TaskAttributesContainer = styled.div`
  margin: 20px;
  margin-left: 30px;

  display: flex;
  align-items: center;
`;

const TaskAttributesTitle = styled.h2`
  margin-right: 15px;
`;

const TaskAttributes = styled.p`
  font-size: 14pt;
`;

const LineContainer = styled.div`
  display: flex;
  align-items: center;

  margin-left: 20px;
`;

const DifficultyVerticalLine = styled.div<{ match: string }>`
  background-color: ${({ match }) => (match === "true" ? "white" : "black")};

  width: ${({ match }) => (match === "true" ? "30px" : "1px")};
  height: 30px;

  border: ${({ match }) => (match === "true" ? "1px solid black" : "none")};
  border-radius: 50px;

  margin-left: ${({ match }) => (match === "true" ? "-15px" : "0")};
  margin-right: ${({ match }) => (match === "true" ? "30px" : "50px")};

  z-index: 1;
`;

const DifficultyHorizontalLine = styled.div`
  position: absolute;
  background-color: black;
  width: 200px;
  height: 1px;

  z-index: 0;
`;

const formatDateTime = (deadline: string) => {
  const deadlineDate = new Date(deadline);
  const now = new Date();

  const isSameDay =
    deadlineDate.getFullYear() === now.getFullYear() &&
    deadlineDate.getMonth() === now.getMonth() &&
    deadlineDate.getDate() === now.getDate();

  return isSameDay
    ? format(deadlineDate, "HH:mm") // 같은 날이면 시간만 표시
    : format(deadlineDate, "yyyy-MM-dd"); // 다르면 날짜 표시
};

const StartPlanButton = styled.button``;

export default function PlanContainer() {
  const { setAlarm } = useAlarm();
  const { showAlert } = useAlert();

  const [, setPlanId] = useAtom(planIdState);
  const [, setPlanTitle] = useAtom(planTitleState);
  const [, setPlanType] = useAtom(planTypeState);
  const [, setPlanTarget] = useAtom(planTargetState);
  const [, setPlanDeadline] = useAtom(planDeadlineState);
  const [, setPlanStartTime] = useAtom(planStartTimeState);

  const [, setPlanProcedures] = useAtom(planProceduresState);
  const [, setPlanSupplies] = useAtom(planSuppliesState);
  const [, setPlanRanges] = useAtom(planRangesState);
  const [, setPlanText] = useAtom(planTextState);

  const [, setPlanETC] = useAtom(planETCState);
  const [, setPlanDifficulty] = useAtom(planDifficultyState);

  const [, setPlanPenalty] = useAtom(planPenaltyState);
  const [, setPlanReward] = useAtom(planRewardState);

  const [, setPlanPopupType] = useAtom(planPopupTypeState);

  const [, setOpenPlanSetting] = useAtom(isPlanPopupOpenState);

  const [update, setUpdate] = useAtom(updateState);
  const [, setContainerUpdate] = useAtom(containerUpdateState);
  const [detail, setDetail] = useAtom(detailState);

  const initialWidth = 500;
  const minWidth = 500;
  const maxWidth = 1000;

  const [width, setWidth] = useState(initialWidth);
  const [partialValue, setPartialValue] = useState<string>("0");

  if (!detail) {
    return null;
  }

  const checkingDetail = async (pid: number, completed: boolean) => {
    const planData = {
      pid: pid,
      completed: !completed,
    };

    try {
      await planComplete(planData);
      setContainerUpdate(pid);
      setUpdate(!update);
    } catch (error) {
      console.error("Error completing plan:", error);
    }
  };

  const checkingSection = async (
    pid: number,
    pdescId: number,
    completed: boolean
  ) => {
    const planData = {
      pid: pid,
      pdescId: pdescId,
      completed: !completed,
    };

    try {
      await planSectionComplete(planData);
      setContainerUpdate(pid);
      setUpdate(!update);
    } catch (error) {
      console.error("Error completing plan:", error);
    }
  };

  const deletePlan = async (pid: number) => {
    const confirmDelete = await showAlert({
      title: "토도리",
      description: `정말로 계획을 삭제하시겠습니까?
삭제 시 패널티가 부여됩니다!`,
    });

    const deleteData = {
      pid: pid,
    };

    if (confirmDelete) {
      try {
        await removePlan(deleteData);
        setContainerUpdate(pid);
        setUpdate(!update);
        setAlarm("success", "계획이 삭제되었습니다.");
      } catch (error) {
        setAlarm("error", "삭제 도중 오류가 발생했습니다.");
      }
    }
  };

  const editPlan = async () => {
    const confirmEdit = await showAlert({
      title: "토도리",
      description: `정말로 계획을 수정하시겠습니까?
삭제 시 패널티가 부여됩니다!`,
    });

    if (confirmEdit) {
      setOpenPlanSetting(true);
      reloadPlan();
      setPlanPopupType("edit");
    }
  };

  const toDatetimeLocal = (utcString: string) => {
    const date = new Date(utcString);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const reloadPlan = () => {
    setPlanId(detail.pid);
    setPlanTitle(detail.title);
    setPlanType(detail.descType);
    setPlanTarget(detail.planType);
    setPlanDeadline(toDatetimeLocal(detail.deadline));
    setPlanStartTime(detail.startTime);

    switch (detail.descType) {
      case "procedure":
        const procedures: string[] = [];

        detail.plandescription.map((item) => {
          procedures.push(item.description);
        });

        setPlanProcedures(procedures);
        break;

      case "supplies":
        const supplies: Set<Record<string, number>> = new Set();

        detail.plandescription.map((item) => {
          let supply: string = item.description.split("(")[0];
          let count: number = parseInt(
            item.description.split("(")[1].split(")")[0]
          );
          supplies.add({ [supply]: count });
        });

        setPlanSupplies(supplies);
        break;

      case "range":
        setPlanRanges(detail.plandescription[0].description);
        break;

      case "text":
        setPlanText(detail.plandescription[0].description);
        break;
    }

    setPlanETC(detail.ETC);
    setPlanDifficulty(detail.difficulty);

    setPlanPenalty(detail.penalty);
    setPlanReward(detail.reward);
  };

  const sectionInfo = (planDescription: any) => {
    planDescription.forEach((desc: any) => {
      alert(
        `${desc.seq}. ${desc.description}
  완료 여부: ${desc.completed}`
      );
    });
  };

  const updatePartialDescription = async (
    detail: any,
    partialValue: number
  ) => {
    const partialData = {
      pdescId: detail.plandescription[0].pdescId,
      seq: partialValue,
    };

    try {
      await partialUpdatePlan(partialData);
      setContainerUpdate(detail.pid);
      setUpdate(!update);
    } catch (error) {
      setAlarm("error", "변경 도중 오류가 발생했습니다.");
    }
  };

  const togglingPlan = async () => {
    // 시작 시 늦었는지 판단과 중단 시 재시작 시간도 설정해야 함

    let planData = {
      pid: detail.pid,
      started: !detail.started,
    };

    if (!detail.started) {
      let currentDateTime =
        dayjs().format("YYYY-MM-DD") + "T" + dayjs().format("HH:mm:ss");
      let estimatedDateTime = detail.startTime.split(".")[0];

      if (currentDateTime > detail.startTime) {
        setAlarm("warning", "지각했기에 패널티를 부여합니다.");
      }

      alert([currentDateTime, estimatedDateTime]);

      planData = {
        pid: detail.pid,
        started: !detail.started,
      };
    } else {
      const result = await showAlert({
        title: "토도리",
        description: `중단 시 패널티가 있습니다!
계속하시겠습니까?`,
      });

      if (!result) return;

      planData = {
        pid: detail.pid,
        started: !detail.started,
      };
    }

    await togglePlan(planData);
    setContainerUpdate(detail.pid);
    setUpdate(!update);
  };

  const RenderDescription = (detail: any) => {
    switch (detail.descType) {
      case "procedure":
        const firstUncompletedDesc = detail.plandescription.find(
          (desc: {
            pid: number;
            pdescId: number;
            description: string;
            seq: string;
            completed: boolean;
          }) => !desc.completed
        );

        return firstUncompletedDesc ? (
          <>
            <Description key={firstUncompletedDesc.pdescId}>
              {firstUncompletedDesc.seq}. {firstUncompletedDesc.description}
            </Description>
            <CompletedSectionButton
              onClick={() =>
                checkingSection(
                  detail.pid,
                  firstUncompletedDesc.pdescId,
                  firstUncompletedDesc.completed
                )
              }
            >
              완료
            </CompletedSectionButton>
            <SectionInfoButton
              onClick={() => sectionInfo(detail.plandescription)}
            >
              상세 보기
            </SectionInfoButton>
          </>
        ) : (
          <>
            <DescriptionLine />
            <Description>작업 완료!</Description>
            <SectionInfoButton
              onClick={() => sectionInfo(detail.plandescription)}
            >
              상세 보기
            </SectionInfoButton>
          </>
        );
      case "supplies":
        return (
          <>
            {detail.plandescription.map(
              (desc: {
                pid: number;
                pdescId: number;
                description: string;
                seq: string;
                completed: boolean;
              }) => (
                <>
                  <Description>{desc.description}</Description>
                  <CompletedSectionButton
                    onClick={() =>
                      checkingSection(desc.pid, desc.pdescId, desc.completed)
                    }
                  >
                    {desc.completed ? "미완료" : "완료"}
                  </CompletedSectionButton>
                </>
              )
            )}
          </>
        );
      case "range":
        return (
          <>
            <Description>
              {!detail.completed && detail.plandescription[0].seq
                ? `${detail.plandescription[0].seq}~${
                    detail.plandescription[0].description.split("~")[1]
                  }`
                : detail.plandescription[0].description}
            </Description>
            {!detail.completed && (
              <>
                <PartialCompletedDescription
                  type="text"
                  value={partialValue}
                  onChange={(e) => setPartialValue(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !isNaN(parseInt(partialValue)) &&
                    updatePartialDescription(detail, parseInt(partialValue))
                  }
                />
                <PartialCompletedDescriptionButton
                  onClick={() =>
                    !isNaN(parseInt(partialValue)) &&
                    parseInt(partialValue) <
                      detail.plandescription[0].description.split("~")[1] &&
                    updatePartialDescription(detail, parseInt(partialValue))
                  }
                >
                  부분 완료
                </PartialCompletedDescriptionButton>
              </>
            )}
          </>
        );
      case "text":
        return detail.plandescription.map((desc: any) => (
          <div key={desc.pdescId}>
            <Description>
              <DescriptionLine />
              {desc.description}
            </Description>
          </div>
        ));
    }

    return null;
  };

  return (
    <ResizableDiv
      width={width}
      minConstraints={[minWidth, 0]}
      maxConstraints={[maxWidth, 0]}
      axis="x"
      resizeHandles={["w"]}
      onResizeStop={(e, data) => {
        setWidth(data.size.width);
      }}
    >
      <DetailHeader>
        <DetailChecked
          completed={`${detail.completed}`}
          onClick={() => checkingDetail(detail.pid, detail.completed)}
        />
        <DetailTitle>{detail.title}</DetailTitle>
        <DetailExit onClick={() => setDetail(undefined)}>X</DetailExit>
        <DetailRemove onClick={() => deletePlan(detail.pid)} />
        <DetailEdit onClick={() => editPlan()} />
      </DetailHeader>

      <DescriptionContainer>{RenderDescription(detail)}</DescriptionContainer>

      <TaskAttributesContainer>
        <TaskAttributesTitle>마감 기한</TaskAttributesTitle>
        <TaskAttributes>~ {formatDateTime(detail.deadline)}</TaskAttributes>
      </TaskAttributesContainer>

      {detail.difficulty && (
        <TaskAttributesContainer>
          <TaskAttributesTitle>난이도</TaskAttributesTitle>
          <LineContainer>
            <DifficultyVerticalLine match={`${detail.difficulty === 1}`} />
            <DifficultyVerticalLine match={`${detail.difficulty === 2}`} />
            <DifficultyVerticalLine match={`${detail.difficulty === 3}`} />
            <DifficultyVerticalLine match={`${detail.difficulty === 4}`} />
            <DifficultyVerticalLine match={`${detail.difficulty === 5}`} />
            <DifficultyHorizontalLine />
          </LineContainer>
        </TaskAttributesContainer>
      )}

      {detail.ETC && (
        <TaskAttributesContainer>
          <TaskAttributesTitle>소요 시간</TaskAttributesTitle>
          <TaskAttributes>{detail.ETC}</TaskAttributes>
        </TaskAttributesContainer>
      )}

      <StartPlanButton onClick={() => togglingPlan()}>
        {!detail.started ? "수행 시작" : "수행 중단"}
      </StartPlanButton>
    </ResizableDiv>
  );
}
