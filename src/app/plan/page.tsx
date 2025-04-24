"use client";

import styled from "styled-components";
import { SelectItem } from "../components/select/SelectItem";
import { orderProps } from "../components/select/props/SelectProps";
import { orderState } from "@/atoms/select/OrderState";
import { PlanPopup } from "../components/plan/PlanPopup";
import {
  containerUpdateState,
  detailState,
  isPlanPopupOpenState,
  planPopupTypeState,
  updateState,
} from "@/atoms/plan_popup/PlanPopupState";
import { useAtom } from "jotai";
import { loadPlan } from "../components/plan/tools/common/LoadPlan";
import { useEffect, useState } from "react";
import { searchPlan } from "../components/plan/tools/search/SearchPlan";
import PlanContainer from "../components/plan/container/PlanContainer";
import { viewDetail } from "../components/common/ViewDetail";
import { useAlarm } from "../tools/alarmFunction/AlarmProvider";
import { AlarmManager } from "../tools/alarmFunction/AlarmManager";
import { displayDifficulty } from "../components/common/DisplayDifficulty";

const Button = styled.button`
  background-color: #719eff;

  width: 68px;
  height: 25px;

  color: white;
  font-family: "Pretendard";
  font-size: 9pt;

  border: none;
  border-radius: 4px;

  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: rgba(230, 230, 230);
  }

  &:active {
    background-color: rgba(240, 240, 240);
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
  }
`;

const PlanSection = styled.section`
  position: relative;

  display: flex;

  height: 83.4%;

  flex-direction: column;

  padding-left: 20px;
  padding-top: 40px;
`;

const SearchableOptionDiv = styled.div`
  position: relative;

  width: 360px;
  height: 35px;

  margin-left: 15px;

  display: flex;
  align-items: center;
`;

const SearchTitle = styled.h2`
  font-family: "Pretendard";
`;

const Search = styled.input`
  position: relative;

  width: 265px;
  height: 100%;

  border-radius: 20px;
  border: 2px solid black;

  padding-left: 15px;

  margin-left: 25px;

  font-family: "Pretendard";
  font-size: 13pt;

  display: flex;
  justify-content: center;

  outline: none;
`;

const SearchButton = styled.div`
  right: 20px;

  position: absolute;
`;

const PlanDiv = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
  width: 530px;

  margin-top: 20px;

  display: flex;
  align-items: center;

  overflow-x: none;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PlanItem = styled.div`
  width: 480px;
  min-height: 160px;

  margin: 15px;
  margin-bottom: 5px;

  padding-left: 10px;

  border: 2px solid black;

  display: flex;

  &:first-child {
    border-top: 2px solid black;
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:only-child {
    border-radius: 8px;
  }
`;

const PlanButton = styled(PlanItem)`
  position: relative;

  border: 2px solid black;

  flex-direction: column;
`;

const AddPlanButton = styled(PlanItem)`
  align-items: center;
  justify-content: center;

  font-family: "Pretendard";
  font-size: 30pt;
  font-weight: 200;
`;

const PlanTitle = styled.h2`
  margin-left: 5px;
  margin-bottom: 10px;
`;
const PlanPenalty = styled.p`
  margin-bottom: 5px;
`;
const PlanReward = styled.p`
  margin-bottom: 5px;
`;
const PlanDeadline = styled.p`
  margin-bottom: 5px;
`;
const PlanDifficulty = styled.p`
  margin-bottom: 5px;
`;
const PlanDuration = styled.p`
  margin-bottom: 5px;
`;
const PlanProgressBarContainer = styled.div<{
  isOnly: string;
  isLast: string;
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: black;

  width: 100%;

  border-radius: ${({ isOnly, isLast }) =>
    isOnly === "true" || isLast === "true" ? "0 0 8px 8px" : "0"};
`;

const PlanProcessBar = styled.div<{
  progress: number;
  isOnly: string;
  isLast: string;
}>`
  background-color: #4caf50;

  width: ${(props) => props.progress}%;
  height: 13px;

  border-radius: ${({ isOnly, isLast }) =>
    isOnly === "true" || isLast === "true" ? "0 0 8px 8px" : "0"};

  transition: width 0.3s ease-in-out;
`;

const Plan = () => {
  const { setAlarm } = useAlarm();

  const [update] = useAtom(updateState);

  const [, setPlanPopupType] = useAtom(planPopupTypeState);
  //
  const [, setOpenPlanSetting] = useAtom(isPlanPopupOpenState);

  const [order] = useAtom(orderState);
  const [containerUpdate, setContainerUpdate] = useAtom(containerUpdateState);
  const [plan, getPlan] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [detail, setDetail] = useAtom(detailState);

  useEffect(() => {
    const loadingPlan = async () => {
      const result = await loadPlan();
      getPlan(result);
    };

    loadingPlan();
  }, [update]);

  useEffect(() => {
    if (containerUpdate === null) return;

    const settingDetail = async () => {
      setDetail(await viewDetail(containerUpdate));
    };

    settingDetail();

    setContainerUpdate(null);
  }, [containerUpdate]);

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const handleKeySearch = (e: any) => {
    if (e.keyCode == 13) {
      searching();
    }
  };

  const searching = async () => {
    const result = await searchPlan(search, order).catch(() => {
      setAlarm("error", "검색 결과가 없습니다.");
    });

    getPlan(result);
  };

  const getProgress = (plandescription: any) => {
    const totalDesc = plandescription.length;
    const completedDesc = plandescription.filter(
      (desc: { completed: any }) => desc.completed
    ).length;
    const progress =
      totalDesc > 0 ? Math.round((completedDesc / totalDesc) * 100) : 0;
    return { progress };
  };

  return (
    <PlanSection>
      <PlanPopup />
      <AlarmManager />

      <SearchableOptionDiv>
        <SearchTitle>계획</SearchTitle>

        <Search
          type="text"
          value={search}
          onKeyDown={(e) => handleKeySearch(e)}
          onChange={(e) => handleSearch(e)}
          maxLength={14}
        />
        <SearchButton onClick={searching}>
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <path
              d="M22.0362 20.1522L27.7433 25.858L25.8578 27.7435L20.152 22.0363C18.029 23.7382 15.3883 24.6639 12.6673 24.66C6.04746 24.66 0.674805 19.2874 0.674805 12.6675C0.674805 6.04762 6.04746 0.674957 12.6673 0.674957C19.2872 0.674957 24.6599 6.04762 24.6599 12.6675C24.6638 15.3885 23.7381 18.0291 22.0362 20.1522ZM19.3632 19.1635C21.0539 17.4241 21.9983 15.0931 21.9949 12.6675C21.9949 7.5147 17.8201 3.33997 12.6673 3.33997C7.51455 3.33997 3.33981 7.5147 3.33981 12.6675C3.33981 17.8203 7.51455 21.995 12.6673 21.995C15.093 21.9984 17.424 21.0541 19.1633 19.3633L19.3632 19.1635Z"
              fill="black"
            />
          </svg>
        </SearchButton>
      </SearchableOptionDiv>

      <PlanDiv>
        {plan &&
          plan.length > 0 &&
          plan.map((plan, index) => {
            const isLast = index === plan.length - 1;
            const isOnly = plan.length === 1;

            const { progress } = getProgress(plan.plandescription);

            return (
              <PlanButton
                onClick={async () => setDetail(await viewDetail(plan.pid))}
                key={plan.pid}
              >
                <PlanTitle>{plan.title}</PlanTitle>
                {plan.deadline && (
                  <PlanDeadline>
                    ~ {new Date(plan.deadline).toLocaleString()}
                  </PlanDeadline>
                )}
                {plan.ETC && <PlanDuration>ETC l {plan.ETC}</PlanDuration>}
                {plan.difficulty && (
                  <PlanDifficulty>
                    난이도 l {displayDifficulty(plan.difficulty)}
                  </PlanDifficulty>
                )}
                {plan.penalty && (
                  <PlanPenalty>벌칙: {plan.penalty}</PlanPenalty>
                )}
                {plan.reward && <PlanReward>보상: {plan.reward}</PlanReward>}
                <PlanProgressBarContainer
                  isLast={`${isLast}`}
                  isOnly={`${isOnly}`}
                >
                  <PlanProcessBar
                    progress={plan.completed ? 100 : progress}
                    isLast={`${isLast}`}
                    isOnly={`${isOnly}`}
                  />
                </PlanProgressBarContainer>
              </PlanButton>
            );
          })}
        <AddPlanButton
          onClick={() => {
            setOpenPlanSetting(true);
            setPlanPopupType("insert");
          }}
        >
          +
        </AddPlanButton>
      </PlanDiv>
      {detail !== undefined && <PlanContainer />}
    </PlanSection>
  );
};

export default Plan;
