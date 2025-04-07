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
} from "@/atoms/plan_popup/PlanPopupState";
import { SelectItem } from "../select/SelectItem";
import { targetProps, typeProps } from "../select/props/SelectProps";
import { insertSupply, removeSupply } from "./tools/ModifySupply";
import {
  editProcedure,
  insertProcedure,
  removeProcedure,
} from "./tools/ProcedureSupply";
import dayjs from "dayjs";
import { createPlan } from "./tools/CreatePlan";
import { insertPlanDescription } from "./tools/InsertPlanDescription";
import { useAlarm } from "@/app/tools/alarmFunction/AlarmProvider";
import { AlarmManager } from "@/app/tools/alarmFunction/AlarmManager";
import { useWaiting } from "@/app/tools/waitFunction/WaitProvider";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Arial, sans-serif;
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

const Title = styled.h1``;

const OptionContainer = styled.div``;
const InputText = styled.input``;
const SelectItemContainer = styled.div`
  display: flex;
`;

const InsertButtonContainer = styled.div``;
const InsertButton = styled.button``;

const InputDescription = styled.text``;
const Supply = styled.button``;

const ButtonContainer = styled.div``;

const MoveButton = styled.button``;
const NextButton = styled(MoveButton)``;
const PreviousButton = styled(MoveButton)``;

const CloseButton = styled.button``;

export const PlanPopup = () => {
  const { setAlarm } = useAlarm();
  const { setWaiting } = useWaiting();

  const [update, setUpdate] = useAtom(updateState);
  const [openSetting, setOpenSetting] = useAtom(isPlanPopupOpenState);

  const [planOrder, setPlanOrder] = useAtom(planOrderState);
  const [nextButtonText, setNextButtonText] = useState<string>("다음");

  // Part 1
  const [planTitle, setPlanTitle] = useAtom(planTitleState);
  const [planType, setPlanType] = useAtom(planTypeState);
  const [planDeadline, setPlanDeadline] = useAtom(planDeadlineState);
  const [planTarget] = useAtom(planTargetState);

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

  const planValues = {
    title: planTitle,
    type: planType,
    deadline: planDeadline,
    target: planTarget,

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

  const setPlanValues = {
    title: setPlanTitle, // 제목, 유형과 마감 기한
    type: setPlanType,
    deadline: setPlanDeadline,

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

  const applyRange = () => {
    let wrongMessage: string = "";

    if (
      isNaN(parseInt(planValues.range1)) ||
      isNaN(parseInt(planValues.range2))
    ) {
      wrongMessage = "숫자만 입력해 주시기 바랍니다.";
    } else if (
      parseInt(planValues.range1) > parseInt(planValues.range2) ||
      parseInt(planValues.range1) < -2147483648 ||
      parseInt(planValues.range2) > 2147483647
    ) {
      wrongMessage = `범위 혹은 값의 설정이 잘못됐습니다.`;
    }

    if (wrongMessage) {
      setAlarm("warning", wrongMessage);
    } else {
      setPlanValues.ranges(`${planValues.range1}~${planValues.range2}`);
    }
  };

  const handlePlanOrderChange = (order: number) => {
    let wrongMessage: string = "";

    if (order === 3) {
      switch (planValues.type) {
        case "procedure":
          const hasEmpty = planValues.procedures.some(
            (item) => item === "" || item === null || item === undefined
          );

          if (hasEmpty) wrongMessage = "절차에 빈 것도 있을 수 있나요?";

          break;
        case "supplies":
          if (planValues.supplies.size === 0)
            wrongMessage = "준비물이 설정돼 있지 않습니다.";

          break;
        case "range":
          if (!planValues.ranges) wrongMessage = "범위 적용이 되지 않았습니다.";

          break;
        case "text":
          if (planValues.text === "") wrongMessage = "입력해 주세요!";

          break;
      }
    }

    if (wrongMessage) {
      setAlarm("warning", wrongMessage);
      return;
    }

    setPlanOrder(order);
    setNextButtonText(order !== 4 ? "다음" : "완료");
  };

  const onPlanInsertSuccess = () => {
    setOpenSetting(false);
    setUpdate(!update);
  };

  const onPlanInsertFail = () => {
    alert("계획 삽입 중 오류가 발생했습니다.");
  };

  const checkPlan = async () => {
    let problemMessage: string = "";

    let currentDay = dayjs().format("YYYY-MM-DD");
    let currentTime = dayjs().format("HH:mm:ss");

    let setDay = planValues.deadline.split("T")[0];
    let setTime = planValues.deadline.split("T")[1];

    const date = new Date(planValues.deadline);
    date.setMinutes(date.getMinutes() - 5);
    let setPossibleTime = date.toLocaleString().split(" ")[4];

    if (planValues.title === "") {
      problemMessage = "제목을 입력해 주세요!";
    } else if (planValues.deadline === "") {
      problemMessage = "마감 기한을 설정해 주세요!";
    } else if (currentDay > setDay) {
      problemMessage = "과거에서 오셨군요 ㅎㅅㅎ";
    } else if (currentDay === setDay && currentTime > setTime) {
      problemMessage = "시간이 뭔가 잘못된 거 같아요!";
    } else if (currentDay === setDay && currentTime > setPossibleTime) {
      problemMessage = "너무 빨라요! 5분 이후로 설정해 주세요!";
    }

    let alertMessage: string = "";

    if (planValues.etc === "" || planValues.difficulty === undefined) {
      alertMessage =
        "설정되지 않은 항목이 있습니다.\n이러한 항목은 추가 점수를 획득하지 못합니다.\n계속하시겠습니까?";
    }

    // 바로 삽입하지 않으면 달력 유저가 충돌을 일으키는 행동을 저지를 수도 있다. 그래서 알림창을 일정 시간 후 꺼지게 해야 한다.

    if (problemMessage) {
      setPlanOrder(1);
      setAlarm("warning", problemMessage);
      return;
    } else if (alertMessage && !confirm(alertMessage)) return;

    setWaiting(true);

    ///
    const planData = {
      title: planValues.title,
      planType: planValues.target,
      deadline: planValues.deadline,
      ETC: planValues.etc,
      difficulty: planValues.difficulty,
      penalty: planValues.penalty,
      reward: planValues.reward,
      descType: planValues.type,
    };

    let pid;

    await createPlan(planData)
      .then((newPlan) => {
        console.log(`계획 삽입 완료: ${newPlan}`);
        pid = newPlan.pid;
      })
      .catch((error) => {
        console.log(`계획 삽입 중 오류 발생: ${error}`);
        setWaiting(false);
        onPlanInsertFail();
        return;
      });

    let planDescData;

    switch (planValues.type) {
      case "procedure":
        const procedures = planValues.procedures;

        let succeed = true;

        for (let i = 0; i < procedures.length; i++) {
          const planDescData = {
            pid: pid,
            descType: "procedure",
            description: procedures[i],
            seq: i + 1,
          };

          await insertPlanDescription(planDescData)
            .then((newPlan) => {
              console.log(`계획 설명 삽입 완료: ${newPlan}`);
            })
            .catch((error) => {
              console.log(`계획 설명 삽입 중 오류 발생: ${error}`);
              succeed = false;
              onPlanInsertFail();
            });
        }

        if (succeed) onPlanInsertSuccess();

        setWaiting(false);

        return;
      case "supplies":
        const supplies = Array.from(planValues.supplies);

        for (let i = 0; i < supplies.length; i++) {
          const [key, value] = Object.entries(supplies[i])[0];

          const planDescData = {
            pid: pid,
            descType: "supplies",
            description: `${key}(${value})`,
            seq: i + 1,
          };

          await insertPlanDescription(planDescData)
            .then((newPlan) => {
              console.log(`계획 설명 삽입 완료: ${newPlan}`);
              onPlanInsertSuccess();
            })
            .catch((error) => {
              console.log(`계획 설명 삽입 중 오류 발생: ${error}`);
              onPlanInsertFail();
            });
        }

        setWaiting(false);

        return;
      default:
        planDescData = {
          pid: pid,
          descType: planValues.type,
          description:
            planValues.type === "text" ? planValues.text : planValues.ranges,
        };
        break;
    }

    await insertPlanDescription(planDescData)
      .then((newPlan) => {
        console.log(`계획 설명 삽입 완료: ${newPlan}`);
        pid = newPlan.pid;
        onPlanInsertSuccess();
      })
      .catch((error) => {
        console.log(`계획 설명 삽입 중 오류 발생: ${error}`);
        onPlanInsertFail();
      });

    setWaiting(false);
  };

  const planScreen = () => {
    switch (planOrder) {
      case 1:
        return (
          <>
            <InputText
              type="text"
              value={planValues.title}
              placeholder="제목"
              onChange={(event) => handleTextChange(event, setPlanValues.title)}
            />
            <SelectItemContainer>
              <SelectItem elements={typeProps} selectState={planTypeState} />
              <SelectItem
                elements={targetProps}
                selectState={planTargetState}
              />
            </SelectItemContainer>
            <InputText
              type="datetime-local"
              value={planValues.deadline}
              placeholder="마감 기한"
              onChange={(event) =>
                handleTextChange(event, setPlanValues.deadline)
              }
            />
          </>
        );
      case 2:
        switch (planValues.type) {
          case "procedure":
            return (
              <>
                <InputDescription>
                  {`
                ${planValues.procedureNumber + 1}/${
                    planValues.procedures.length
                  }
                `}
                </InputDescription>
                <InputText
                  type="text"
                  value={planValues.procedures[planValues.procedureNumber]}
                  placeholder="내용 입력"
                  onChange={(event) =>
                    editProcedure(
                      event.target.value,
                      planValues.procedures,
                      setPlanValues.procedures,
                      planValues.procedureNumber
                    )
                  }
                />
                <InsertButtonContainer>
                  {planValues.procedureNumber !== 0 && (
                    <InsertButton
                      onClick={() =>
                        setPlanValues.procedureNumber(
                          planValues.procedureNumber - 1
                        )
                      }
                    >
                      이전 절차
                    </InsertButton>
                  )}
                  {planValues.procedures.length - 1 !==
                  planValues.procedureNumber ? (
                    <InsertButton
                      onClick={() =>
                        setPlanValues.procedureNumber(
                          planValues.procedureNumber + 1
                        )
                      }
                    >
                      다음 절차
                    </InsertButton>
                  ) : (
                    <InsertButton
                      onClick={() => {
                        insertProcedure(
                          planValues.procedures,
                          setPlanValues.procedures
                        );
                        setPlanValues.procedureNumber(
                          planValues.procedureNumber + 1
                        );
                      }}
                    >
                      절차 추가
                    </InsertButton>
                  )}
                  {planValues.procedures.length !== 1 && (
                    <InsertButton
                      onClick={() => {
                        removeProcedure(
                          planValues.procedures,
                          setPlanValues.procedures,
                          planValues.procedureNumber
                        );
                        if (
                          planValues.procedures.length - 1 ===
                          planValues.procedureNumber
                        )
                          setPlanValues.procedureNumber(
                            planValues.procedureNumber - 1
                          );
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
                {Array.from(planValues.supplies).map((item, index) => (
                  <div key={index}>
                    {Object.entries(item).map(([key, value]) => (
                      <Supply
                        onClick={() =>
                          removeSupply(key, setPlanValues.supplies)
                        }
                      >{`${key}(${value})`}</Supply>
                    ))}
                  </div>
                ))}

                <InputText
                  type="text"
                  placeholder="필요 물품 입력"
                  onChange={(event) =>
                    handleTextChange(event, setPlanValues.supply)
                  }
                />
                <InputText
                  type="text"
                  placeholder="개수 입력(1개면 생략)"
                  onChange={(event) =>
                    handleTextChange(event, setPlanValues.supplyCount)
                  }
                />
                <InsertButton
                  onClick={() => {
                    if (planValues.supply)
                      insertSupply(
                        planValues.supply,
                        planValues.supplyCount,
                        planValues.supplies,
                        setPlanValues.supplies
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
                <InputDescription>{planValues.ranges}</InputDescription>
                <InputText
                  type="text"
                  value={planValues.range1}
                  onChange={(event) =>
                    handleTextChange(event, setPlanValues.range1)
                  }
                />
                <>~</>
                <InputText
                  type="text"
                  value={planValues.range2}
                  onChange={(event) =>
                    handleTextChange(event, setPlanValues.range2)
                  }
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
                  value={planValues.text}
                  onChange={(event) =>
                    handleTextChange(event, setPlanValues.text)
                  }
                />
              </>
            );
        }

        break;

      case 3:
        return (
          <>
            <InputText
              type="time"
              placeholder="예상 작업 시간"
              value={planValues.etc}
              onChange={(event) => handleTextChange(event, setPlanValues.etc)}
            />
            <OptionContainer>
              {[1, 2, 3, 4, 5].map((difficulty) => (
                <label key={difficulty}>
                  <InputText
                    type="radio"
                    name="difficulty"
                    value={difficulty}
                    checked={planValues.difficulty == difficulty}
                    onChange={(event) =>
                      handleTextChange(event, setPlanValues.difficulty)
                    }
                  />
                  <InputDescription>{difficulty}</InputDescription>
                </label>
              ))}
            </OptionContainer>
          </>
        );

      case 4:
        return (
          <>
            <InputText
              type="text"
              value={planValues.penalty}
              placeholder="벌칙"
              onChange={(event) =>
                handleTextChange(event, setPlanValues.penalty)
              }
            />
            <InputText
              type="text"
              value={planValues.reward}
              placeholder="보상"
              onChange={(event) =>
                handleTextChange(event, setPlanValues.reward)
              }
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

      <Title>{planOrder > 1 ? planValues.title : "계획 설정"}</Title>

      {planScreen()}

      <ButtonContainer>
        {planOrder != 1 && (
          <PreviousButton onClick={() => handlePlanOrderChange(planOrder - 1)}>
            이전
          </PreviousButton>
        )}
        <NextButton
          onClick={() =>
            planOrder < 4 ? handlePlanOrderChange(planOrder + 1) : checkPlan()
          }
        >
          {nextButtonText}
        </NextButton>
      </ButtonContainer>

      <CloseButton onClick={() => setOpenSetting(false)}>나가기</CloseButton>
    </StyledModal>
  );
};
