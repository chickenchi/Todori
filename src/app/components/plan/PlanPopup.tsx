import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Modal from "react-modal";
import {
  isPlanPopupOpenState,
  planDeadlineState,
  planSuppliesState,
  planDifficultyState,
  planETCState,
  planOrderState,
  planPenaltyState,
  planRewardState,
  planTargetState,
  planTitleState,
  planTypeState,
  planProceduresState,
  planTextState,
  planRangesState,
  updateState,
  planStartTimeState,
  planPopupTypeState,
  planIdState,
  planImmediateStartState,
  planPeriodicityState,
} from "@/atoms/plan_popup/PlanPopupState";
import { SelectItem } from "../select/SelectItem";
import {
  periodicityProps,
  targetProps,
  typeProps,
} from "../select/props/SelectProps";
import { insertSupply, removeSupply } from "./tools/popup/ModifySupply";
import {
  editProcedure,
  insertProcedure,
  removeProcedure,
} from "./tools/popup/ProcedureSupply";
import dayjs from "dayjs";
import { createPlan } from "./tools/popup/CreatePlan";
import { insertPlanDescription } from "./tools/popup/InsertPlanDescription";
import { useAlarm } from "@/app/tools/alarmFunction/AlarmProvider";
import { AlarmManager } from "@/app/tools/alarmFunction/AlarmManager";
import { useWaiting } from "@/app/tools/waitFunction/WaitProvider";
import { useAlert } from "@/app/tools/alertFunction/AlertProvider";
import { modifyPlan } from "./tools/popup/ModifyPlan";
import { clearPlanDescription } from "./tools/popup/ClearPlanDescription";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: "Pretendard";
    overflow: hidden;
  }

  .ReactModal__Overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9998;
  }
`;

// 모달 스타일을 위한 Styled component
const StyledModal = styled(Modal)`
  &.ReactModal__Content {
    position: relative;
    top: 50%;
    left: 50%;

    background-color: rgb(250, 250, 250);

    max-width: 600px;
    width: 100%;
    height: 400px;

    padding: 30px;

    border-radius: 5px;

    transform: translate(-50%, -50%);

    display: flex;
    align-items: center;
    flex-direction: column;

    outline: none;

    z-index: 9999;
  }
`;

const TargetDescription = styled.p``;

const WeekContainer = styled.div`
  display: flex;
`;
const WeekdayContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const WeekText = styled.p``;
const Week = styled.input``;

const IntervalListContainer = styled.div`
  display: flex;
`;
const IntervalContainer = styled.div`
  display: flex;
  align-items: center;
`;
const IntervalText = styled.p``;
const Interval = styled.input``;

const AlternativeContainer = styled.div`
  display: flex;
`;
const AlternativePeriodicity = styled.input`
  width: 20px;
  text-align: center;
`;
const AlternativePeriodicityDate = styled.select`
  margin-right: 5px;
`;
const AlternativeCount = styled.input`
  width: 30px;
  text-align: center;
`;
const AlternativeCountText = styled.p``;
const AlternativeCountRange = styled.select`
  margin-left: 5px;
`;

const Title = styled.h1`
  font-family: "Pretendard";
`;

const OptionContainer = styled.div`
  font-family: "Pretendard";
`;
const InputText = styled.input`
  font-family: "Pretendard";
`;

const InsertButtonContainer = styled.div``;
const InsertButton = styled.button`
  font-family: "Pretendard";
`;

const InputDescription = styled.text`
  font-family: "Pretendard";
`;
const Supply = styled.button``;

const ButtonContainer = styled.div``;

const MoveButton = styled.button`
  font-family: "Pretendard";
`;
const NextButton = styled(MoveButton)``;
const PreviousButton = styled(MoveButton)``;

const CloseButton = styled.button``;

export const PlanPopup = () => {
  const { setAlarm } = useAlarm();
  const { showAlert } = useAlert();
  const { setWaiting } = useWaiting();

  const [planPopupType] = useAtom(planPopupTypeState);

  const [update, setUpdate] = useAtom(updateState);
  const [openSetting, setOpenSetting] = useAtom(isPlanPopupOpenState);

  const [planOrder, setPlanOrder] = useAtom(planOrderState);
  const [nextButtonText, setNextButtonText] = useState<string>("다음");

  // Part 1
  const [planId] = useAtom(planIdState);
  const [planTitle, setPlanTitle] = useAtom(planTitleState);
  const [planType, setPlanType] = useAtom(planTypeState);
  const [planDeadline, setPlanDeadline] = useAtom(planDeadlineState);

  const [planStartTime, setPlanStartTime] = useAtom(planStartTimeState);
  const [planImmediateStart, setPlanImmediateStart] = useAtom(
    planImmediateStartState
  );

  const [planTarget] = useAtom(planTargetState);
  const [planPeriodicity] = useAtom(planPeriodicityState);

  // Part 2
  const [planSupplies, setPlanSupplies] = useAtom(planSuppliesState);
  const [planSupply, setPlanSupply] = useState<string>("");
  const [planSupplyCount, setPlanSupplyCount] = useState<string>("");

  const [planProcedures, setPlanProcedures] = useAtom(planProceduresState);
  const [planProcedureNumber, setPlanProcedureNumber] = useState<number>(0);

  const [planRanges, setPlanRanges] = useAtom(planRangesState);
  const [planRange1, setPlanRange1] = useState<string>("");
  const [planRange2, setPlanRange2] = useState<string>("");

  const [plantext, setPlantext] = useAtom(planTextState);

  // Part 3
  const [planETC, setPlanETC] = useAtom(planETCState);
  const [planDifficulty, setPlanDifficulty] = useAtom(planDifficultyState);

  // Part 4
  const [planPenalty, setPlanPenalty] = useAtom(planPenaltyState);
  const [planReward, setPlanReward] = useAtom(planRewardState);

  const plan = {
    pid: planId,
    title: planTitle,
    type: planType,

    target: planTarget,
    periodicity: planPeriodicity,

    deadline: planDeadline,
    startTime: planStartTime,
    immediateStart: planImmediateStart,

    supplies: planSupplies,
    supply: planSupply,
    supplyCount: planSupplyCount,

    procedures: planProcedures,
    procedureNumber: planProcedureNumber,

    ranges: planRanges,
    range1: planRange1,
    range2: planRange2,

    text: plantext,

    etc: planETC,
    difficulty: planDifficulty,

    penalty: planPenalty,
    reward: planReward,
  };

  const setPlan = {
    title: setPlanTitle, // 제목, 유형과 마감 기한
    type: setPlanType,

    deadline: setPlanDeadline,
    startTime: setPlanStartTime,
    immediateStart: setPlanImmediateStart,

    /* 계획 내용 */
    supplies: setPlanSupplies,
    supply: setPlanSupply,
    supplyCount: setPlanSupplyCount,

    procedures: setPlanProcedures,
    procedureNumber: setPlanProcedureNumber,

    ranges: setPlanRanges,
    range1: setPlanRange1,
    range2: setPlanRange2,

    text: setPlantext,

    etc: setPlanETC, // 예상 진행 속도 및 난이도
    difficulty: setPlanDifficulty,

    penalty: setPlanPenalty, // 보상 및 패널티(패널티 미이수 시 캐릭터 영향)
    reward: setPlanReward,
  };

  const handleTextChange = <T,>(
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => {
    setter(event.target.value as T); // 입력 값을 setter에 맞는 타입으로 변환
  };

  const handleImmediateChange = () => {
    setPlan.immediateStart(!plan.immediateStart);
  };

  const applyRange = () => {
    let wrongMessage: string = "";

    if (isNaN(parseInt(plan.range1)) || isNaN(parseInt(plan.range2))) {
      wrongMessage = "숫자만 입력해 주시기 바랍니다.";
    } else if (
      parseInt(plan.range1) > parseInt(plan.range2) ||
      parseInt(plan.range1) < -2147483648 ||
      parseInt(plan.range2) > 2147483647
    ) {
      wrongMessage = `범위 혹은 값의 설정이 잘못됐습니다.`;
    }

    if (wrongMessage) {
      setAlarm("warning", wrongMessage);
    } else {
      setPlan.ranges(`${plan.range1}~${plan.range2}`);
    }
  };

  const handlePlanOrderChange = (order: number) => {
    let wrongMessage: string = "";

    if (order === 3) {
      switch (plan.type) {
        case "procedure":
          const hasEmpty = plan.procedures.some(
            (item) => item === "" || item === null || item === undefined
          );

          if (hasEmpty) wrongMessage = "절차에 빈 것도 있을 수 있나요?";

          break;
        case "supplies":
          if (plan.supplies.size === 0)
            wrongMessage = "준비물이 설정돼 있지 않습니다.";
          break;
        case "range":
          if (!plan.ranges) wrongMessage = "범위 적용이 되지 않았습니다.";

          break;
        case "text":
          if (plan.text === "") wrongMessage = "입력해 주세요!";

          break;
      }
    }

    if (wrongMessage) {
      setAlarm("warning", wrongMessage);
      return;
    }

    setPlanOrder(order);
    setNextButtonText(order !== 6 ? "다음" : "완료");
  };

  const onPlanSettingSuccess = () => {
    setOpenSetting(false);
    setUpdate(!update);
  };

  const onPlanSettingFail = () => {
    setAlarm(
      "error",
      `계획 ${
        planPopupType === "insert" ? "삽입" : "수정"
      } 중 오류가 발생했습니다.`
    );
  };

  const confirmDifficulty = async () => {
    const confirmed = await showAlert({
      title: "토도리",
      description: `난이도 미설정 시 이에 대한 추가 점수를 획득하지 못합니다.\n계속하시겠습니까?`,
    });

    if (confirmed) {
      setPlanOrder(6);
      return false;
    }
  };

  const checkPlan = async () => {
    let problemMessage: string = "";

    let currentDay = dayjs().format("YYYY-MM-DD");
    let currentTime = dayjs().format("HH:mm");

    // deadline

    let setDay = plan.deadline.split("T")[0];
    let setTime: string = plan.deadline.split("T")[1];

    const date = new Date(plan.deadline);
    date.setMinutes(date.getMinutes() - 5);
    let setPossibleTime = date.toLocaleString().split(" ")[4];

    // startTime

    let setStartDay = plan.startTime.split("T")[0];
    let setStartTime = plan.startTime.split("T")[1];

    let moveOrder: number = 0;

    // title
    switch (true) {
      case plan.title === "":
        problemMessage = "제목을 입력해 주세요!";
        moveOrder = 1;
        break;

      // deadline
      case plan.deadline === "":
        problemMessage = "마감 기한을 설정해 주세요!";
        moveOrder = 4;
        break;
      case currentDay > setDay:
        problemMessage = "과거에서 오셨군요 ㅎㅅㅎ";
        moveOrder = 4;
        break;
      case currentDay === setDay && currentTime > setTime:
        problemMessage = "시간이 뭔가 잘못된 거 같아요!";
        moveOrder = 4;
        break;
      case currentDay === setDay && currentTime > setPossibleTime:
        problemMessage = "너무 빨라요! 5분 이후로 설정해 주세요!";
        moveOrder = 4;
        break;

      // startTime
      case plan.immediateStart:
        setPlan.startTime(currentDay + "T" + currentTime);
        break;
      case !plan.immediateStart:
        switch (true) {
          case plan.startTime === "":
            problemMessage = "시작 시간을 정해야 계획이 완벽해져요!";
            moveOrder = 4;
            break;
          // 시작 날짜를 과거로 했는지 / 시작 날짜가 마감 날짜보다 미래로 했는지
          case currentDay > setStartDay || setStartDay > setDay:
            problemMessage = "어떻게 시작하시려고요?";
            moveOrder = 4;
            break;
          /*
         1. 현재 날짜와 시작 날짜가 같을 때
          -> 현재 시간과 시작 시간과 동일 혹은
            시작 시간을 과거로 했는지
         2. 마감 날짜와 시작 날짜가 같을 때
          -> 마감 시간과 시작 날짜와 동일 혹은
            시작 날짜를 마감 날짜보다 미래로 했는지 */
          case (currentDay === setStartDay && currentTime >= setStartTime) ||
            (setDay === setStartDay && setTime <= setStartTime):
            problemMessage = "시작 시간이 뭔가 잘못된 거 같아요!";
            moveOrder = 4;
            break;
        }
        break;
    }

    if (problemMessage) {
      setPlanOrder(moveOrder); // 처음 위치로 돌아감
      setNextButtonText("다음");
      setAlarm("warning", problemMessage);
      return false;
    }

    return true;
  };

  const insertOrEditPlan = async () => {
    const check = await checkPlan();
    if (!check) return;

    setWaiting(true);

    ///
    const planData: {
      title: string;
      planType: string;
      deadline: string;
      startTime: string;
      ETC: string;
      difficulty?: number;
      penalty: string;
      reward: string;
      descType: string;
      pid?: number | null;
      started?: boolean;
    } = {
      title: plan.title,
      planType: plan.target,
      deadline: plan.deadline,
      startTime: plan.startTime,
      ETC: plan.etc,
      difficulty: plan.difficulty,
      penalty: plan.penalty,
      reward: plan.reward,
      descType: plan.type,
      started: false,
    };

    let pid;

    if (plan.pid != null) {
      planData.pid = plan.pid;
      pid = planData.pid;
    }

    if (plan.immediateStart === true) {
      planData.started = true;
    }

    if (planPopupType === "insert") {
      try {
        const newPlan = await createPlan(planData);
        console.log(`계획 삽입 완료: ${newPlan}`);
        pid = newPlan.pid;
      } catch (error) {
        console.log(`계획 삽입 중 오류 발생: ${error}`);
        setWaiting(false);
        onPlanSettingFail();
        return;
      }
    } else {
      try {
        const modifiedPlan = await modifyPlan(planData);
        console.log(`계획 수정 완료: ${modifiedPlan}`);
        pid = modifiedPlan.pid;
      } catch (error) {
        console.log(`계획 수정 중 오류 발생: ${error}`);
        setWaiting(false);
        onPlanSettingFail();
        return;
      }
    }

    let planDescData;

    let succeed = true;

    if (planPopupType !== "insert") await clearPlanDescription(planData);

    switch (plan.type) {
      case "procedure":
        const procedures = plan.procedures;

        for (let i = 0; i < procedures.length; i++) {
          const planDescData = {
            pid: pid,
            descType: "procedure",
            description: procedures[i],
            seq: i + 1,
          };

          await insertPlanDescription(planDescData)
            .then((newPlanDesc) => {
              console.log(`계획 설명 삽입 완료: ${newPlanDesc}`);
            })
            .catch((error) => {
              console.log(`계획 설명 삽입 중 오류 발생: ${error}`);
              succeed = false;
              onPlanSettingFail();
            });
        }

        if (succeed) onPlanSettingSuccess();

        setWaiting(false);

        return;
      case "supplies":
        const supplies = Array.from(plan.supplies);

        for (let i = 0; i < supplies.length; i++) {
          const [key, value] = Object.entries(supplies[i])[0];

          const planDescData = {
            pid: pid,
            descType: "supplies",
            description: `${key}(${value})`,
            seq: i + 1,
          };

          await insertPlanDescription(planDescData)
            .then((newPlanDesc) => {
              console.log(`계획 설명 삽입 완료: ${newPlanDesc}`);
              onPlanSettingSuccess();
            })
            .catch((error) => {
              console.log(`계획 설명 삽입 중 오류 발생: ${error}`);
              succeed = false;
              onPlanSettingFail();
            });
        }

        if (succeed) onPlanSettingSuccess();

        setWaiting(false);

        return;
      default:
        planDescData = {
          pid: pid,
          descType: plan.type,
          description: plan.type === "text" ? plan.text : plan.ranges,
        };
        break;
    }

    await insertPlanDescription(planDescData)
      .then((newPlanDesc) => {
        console.log(`계획 설명 삽입 완료: ${newPlanDesc}`);
        pid = newPlanDesc.pid;
        onPlanSettingSuccess();
      })
      .catch((error) => {
        console.log(`계획 설명 삽입 중 오류 발생: ${error}`);
        succeed = false;
        onPlanSettingFail();
      });

    if (succeed) onPlanSettingSuccess();

    setWaiting(false);
  };

  const descType = () => {
    switch (plan.type) {
      case "procedure":
        return (
          <>
            <InputDescription>
              {`
              ${plan.procedureNumber + 1}/${plan.procedures.length}
              `}
            </InputDescription>
            <InputText
              type="text"
              value={plan.procedures[plan.procedureNumber]}
              placeholder="내용 입력"
              onChange={(event) =>
                editProcedure(
                  event.target.value,
                  plan.procedures,
                  setPlan.procedures,
                  plan.procedureNumber
                )
              }
            />
            <InsertButtonContainer>
              {plan.procedureNumber !== 0 && (
                <InsertButton
                  onClick={() =>
                    setPlan.procedureNumber(plan.procedureNumber - 1)
                  }
                >
                  이전 절차
                </InsertButton>
              )}
              {plan.procedures.length - 1 !== plan.procedureNumber ? (
                <InsertButton
                  onClick={() =>
                    setPlan.procedureNumber(plan.procedureNumber + 1)
                  }
                >
                  다음 절차
                </InsertButton>
              ) : (
                <InsertButton
                  onClick={() => {
                    insertProcedure(plan.procedures, setPlan.procedures);
                    setPlan.procedureNumber(plan.procedureNumber + 1);
                  }}
                >
                  절차 추가
                </InsertButton>
              )}
              {plan.procedures.length !== 1 && (
                <InsertButton
                  onClick={() => {
                    removeProcedure(
                      plan.procedures,
                      setPlan.procedures,
                      plan.procedureNumber
                    );
                    if (plan.procedures.length - 1 === plan.procedureNumber)
                      setPlan.procedureNumber(plan.procedureNumber - 1);
                  }}
                >
                  절차 삭제
                </InsertButton>
              )}
            </InsertButtonContainer>
          </>
        );
      case "supplies":
        return (
          <>
            {Array.from(plan.supplies).map((item, index) => (
              <div key={index}>
                {Object.entries(item).map(([key, value]) => (
                  <Supply
                    onClick={() => removeSupply(key, setPlan.supplies)}
                  >{`${key}(${value})`}</Supply>
                ))}
              </div>
            ))}

            <InputText
              type="text"
              value={plan.supply}
              placeholder="필요 물품 입력"
              onChange={(event) => handleTextChange(event, setPlan.supply)}
            />
            <InputText
              type="text"
              value={plan.supplyCount}
              placeholder="개수 입력(1개면 생략)"
              onChange={(event) => handleTextChange(event, setPlan.supplyCount)}
            />
            <InsertButton
              onClick={() => {
                if (plan.supply)
                  insertSupply(
                    plan.supply,
                    plan.supplyCount,
                    plan.supplies,
                    setPlan.supplies
                  );
              }}
            >
              삽입
            </InsertButton>
          </>
        );
      case "range":
        return (
          <>
            <InputDescription>{plan.ranges}</InputDescription>
            <InputText
              type="text"
              value={plan.range1}
              onChange={(event) => handleTextChange(event, setPlan.range1)}
            />
            <>~</>
            <InputText
              type="text"
              value={plan.range2}
              onChange={(event) => handleTextChange(event, setPlan.range2)}
            />
            <InsertButton
              onClick={() => {
                applyRange();
              }}
            >
              적용
            </InsertButton>
          </>
        );
      case "text":
        return (
          <>
            <InputText
              type="text"
              value={plan.text}
              onChange={(event) => handleTextChange(event, setPlan.text)}
            />
          </>
        );
    }
  };

  const targetType = () => {
    switch (planTarget) {
      case "routine":
        return (
          <TargetDescription>
            일과는 하루에 무엇을 할지 계획 삭제 전까지 알아서 생성해 줘요.
          </TargetDescription>
        );
      case "periodicity":
        return (
          <>
            <SelectItem
              elements={periodicityProps}
              selectState={planPeriodicityState}
            />
            {periodicityType()}
          </>
        );
      case "project":
        return (
          <TargetDescription>
            프로젝트 단위에서 시행하는 계획을 지정할 수 있어요.
          </TargetDescription>
        );
      case "common":
        return (
          <TargetDescription>
            분류가 딱히 없을 때 지정하는 옵션이에요.
          </TargetDescription>
        );
    }
  };

  const periodicityType = () => {
    const weekdays = {
      Mon: "월",
      Tue: "화",
      Wed: "수",
      Thu: "목",
      Fri: "금",
      Sat: "토",
      Sun: "일",
    };

    const intervalList = {
      day: "격일제",
      week: "격주제",
      year: "격년제",
    };

    switch (plan.periodicity) {
      case "week":
        return (
          <>
            <WeekContainer>
              {Object.entries(weekdays).map(([key, label]) => (
                <WeekdayContainer key={key}>
                  <WeekText>{label}</WeekText>
                  <Week type="checkbox" value={key} />
                </WeekdayContainer>
              ))}
            </WeekContainer>
          </>
        );
      case "interval":
        return (
          <>
            <IntervalListContainer>
              {Object.entries(intervalList).map(([key, label]) => (
                <IntervalContainer key={key}>
                  <IntervalText>{label}</IntervalText>
                  <Interval type="radio" name="interval" value={key} />
                </IntervalContainer>
              ))}
            </IntervalListContainer>
          </>
        );
      case "alternate":
        return (
          <AlternativeContainer>
            <AlternativePeriodicity type="text" />
            <AlternativePeriodicityDate>
              <option value="">일</option>
              <option value="">월</option>
              <option value="">년</option>
            </AlternativePeriodicityDate>
            <AlternativeCount type="text" />
            <AlternativeCountText>회</AlternativeCountText>
            <AlternativeCountRange>
              <option value="">미만</option>
              <option value="">이하</option>
              <option value="">이상</option>
              <option value="">초과</option>
            </AlternativeCountRange>
          </AlternativeContainer>
        );
        break;
    }
  };

  const planScreen = () => {
    switch (planOrder) {
      case 1:
        return (
          <>
            <InputText
              type="text"
              value={plan.title}
              placeholder="제목"
              onChange={(event) => handleTextChange(event, setPlan.title)}
            />
          </>
        );
      case 2:
        return (
          <>
            <SelectItem elements={typeProps} selectState={planTypeState} />
            {descType()}
          </>
        );

      case 3:
        return (
          <>
            <SelectItem elements={targetProps} selectState={planTargetState} />
            {targetType()}
          </>
        );
      case 4:
        return (
          <>
            {!plan.immediateStart && (
              <>
                시작 예정 시간
                <InputText
                  type="datetime-local"
                  value={plan.startTime}
                  placeholder="시작 예정 시간"
                  onChange={(event) =>
                    handleTextChange(event, setPlan.startTime)
                  }
                />
              </>
            )}
            <>작성 후 즉시 시작</>
            <InputText
              type="checkbox"
              onChange={() => handleImmediateChange()}
              checked={plan.immediateStart}
            />
            마감 기한
            <InputText
              type="datetime-local"
              value={plan.deadline}
              placeholder="마감 기한"
              onChange={(event) => handleTextChange(event, setPlan.deadline)}
            />
          </>
        );
      case 5:
        return (
          <>
            <InputText
              type="text"
              placeholder="작업 시간[n일 m시간 o분(초 불가)]"
              value={plan.etc}
              onChange={(event) => handleTextChange(event, setPlan.etc)}
            />
            <OptionContainer>
              {[1, 2, 3, 4, 5].map((difficulty) => (
                <label key={difficulty}>
                  <InputText
                    type="radio"
                    name="difficulty"
                    value={difficulty}
                    checked={plan.difficulty == difficulty}
                    onChange={(event) =>
                      handleTextChange(event, setPlan.difficulty)
                    }
                  />
                  <InputDescription>{difficulty}</InputDescription>
                </label>
              ))}
            </OptionContainer>
          </>
        );

      case 6:
        return (
          <>
            <InputText
              type="text"
              value={plan.penalty}
              placeholder="벌칙"
              onChange={(event) => handleTextChange(event, setPlan.penalty)}
            />
            <InputText
              type="text"
              value={plan.reward}
              placeholder="보상"
              onChange={(event) => handleTextChange(event, setPlan.reward)}
            />
          </>
        );
    }
  };

  return (
    <StyledModal
      isOpen={openSetting}
      onRequestClose={() => setOpenSetting(false)}
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <GlobalStyle />
      <AlarmManager />

      <Title>{planOrder > 1 && plan.title ? plan.title : "계획 설정"}</Title>

      {planScreen()}

      <ButtonContainer>
        {planOrder != 1 && (
          <PreviousButton onClick={() => handlePlanOrderChange(planOrder - 1)}>
            이전
          </PreviousButton>
        )}
        <NextButton
          onClick={() =>
            planOrder === 5 && !plan.difficulty
              ? confirmDifficulty()
              : planOrder < 6
              ? handlePlanOrderChange(planOrder + 1)
              : planPopupType === "insert" || planPopupType === "edit"
              ? insertOrEditPlan()
              : setAlarm("warning", "뭔가 잘못된 거 같아요!")
          }
        >
          {nextButtonText}
        </NextButton>
      </ButtonContainer>

      <CloseButton onClick={() => setOpenSetting(false)}>나가기</CloseButton>
    </StyledModal>
  );
};
