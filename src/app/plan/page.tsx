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
  updateState,
} from "@/atoms/plan_popup/PlanPopupState";
import { useAtom } from "jotai";
import { loadPlan } from "../components/plan/tools/LoadPlan";
import { useEffect, useState } from "react";
import { searchPlan } from "../components/plan/tools/SearchPlan";
import PlanContainer from "../components/plan/container/PlanContainer";
import { viewDetail } from "../components/common/ViewDetail";

const Button = styled.button`
  background-color: #719eff;

  width: 68px;
  height: 25px;

  color: white;
  font-size: 9pt;

  border: none;
  border-radius: 4px;

  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  font-family: "Pretendard";

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
  display: flex;

  flex-direction: column;

  margin-top: 20px;
`;

const SearchableOptionDiv = styled.div`
  width: 100%;
  height: 20px;

  margin-left: 15px;

  display: flex;
  align-items: center;
`;

const OrderDiv = styled.div`
  margin-left: 5px;
`;

const Search = styled.input`
  height: 100%;

  margin-left: 20px;
`;

const SearchButton = styled(Button)`
  margin: 2px;
`;

const PlanDiv = styled.div`
  display: flex;
  /* flex-direction: 'row'; */
  flex-wrap: wrap;

  width: 100%;

  margin-left: 20px;
  margin-top: 20px;

  overflow-x: none;
  overflow-y: auto;
`;

const PlanItem = styled.div`
  width: 300px;
  height: 260px;

  margin: 15px;

  border: 1px solid black;
  border-radius: 5px;

  display: flex;
`;

const PlanButton = styled(PlanItem)`
  position: relative;

  border: 1px solid black;

  flex-direction: column;
`;
const PlanTitle = styled.h2`
  margin-left: 20px;
`;
const PlanPenalty = styled.p``;
const PlanReward = styled.p``;
const PlanDeadline = styled.p``;
const PlanDifficulty = styled.p``;
const PlanDuration = styled.p``;
const PlanProgressBarContainer = styled.div`
  position: absolute;
  bottom: 0;
  background-color: black;

  width: 100%;

  border-radius: 5px;
`;
const PlanProcessBar = styled.div<{ progress: number }>`
  background-color: #4caf50;

  width: ${(props) => props.progress}%;
  height: 20px;

  border-radius: 5px;

  transition: width 0.3s ease-in-out;
`;

const AddPlanButton = styled(PlanItem)`
  align-items: center;
  justify-content: center;

  font-size: 30pt;
  font-weight: 200;
`;

const Plan = () => {
  const [update] = useAtom(updateState);
  const [, setOpenSetting] = useAtom(isPlanPopupOpenState);
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
      alert("검색 결과가 없습니다.");
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

      <SearchableOptionDiv>
        <Search
          type="text"
          value={search}
          onKeyDown={(e) => handleKeySearch(e)}
          onChange={(e) => handleSearch(e)}
        />

        <OrderDiv>
          <SelectItem elements={orderProps} selectState={orderState} />
        </OrderDiv>

        <SearchButton onClick={searching}>검색</SearchButton>
      </SearchableOptionDiv>

      <PlanDiv>
        {plan &&
          plan.length > 0 &&
          plan.map((plan) => {
            const { progress } = getProgress(plan.plandescription);

            return (
              <PlanButton
                onClick={async () => setDetail(await viewDetail(plan.pid))}
                key={plan.pid}
              >
                <PlanTitle>{plan.title}</PlanTitle>
                <PlanDeadline>
                  마감일: {new Date(plan.deadline).toLocaleString()}
                </PlanDeadline>
                {plan.ETC && (
                  <PlanDuration>예상 작업 시간: {plan.ETC}</PlanDuration>
                )}
                {plan.difficulty && (
                  <PlanDifficulty>난이도: {plan.difficulty}</PlanDifficulty>
                )}
                {plan.penalty && (
                  <PlanPenalty>벌칙: {plan.penalty}</PlanPenalty>
                )}
                {plan.reward && <PlanReward>보상: {plan.reward}</PlanReward>}
                <PlanProgressBarContainer>
                  <PlanProcessBar progress={plan.completed ? 100 : progress} />
                </PlanProgressBarContainer>
              </PlanButton>
            );
          })}
        <AddPlanButton onClick={() => setOpenSetting(true)}>+</AddPlanButton>

        {detail !== undefined && <PlanContainer />}
      </PlanDiv>
    </PlanSection>
  );
};

export default Plan;
