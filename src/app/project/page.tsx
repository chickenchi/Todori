"use client";

import styled from "styled-components";
import { SelectItem } from "../components/select/SelectItem";
import { orderProps } from "../components/select/props/SelectProps";
import { orderState } from "@/atoms/select/OrderState";

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

const PlanHeader = styled.header`
  display: flex;

  flex-direction: column;
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

const PlanButton = styled(PlanItem)``;
const PlanTitle = styled.h2`
  margin-left: 20px;
`;

const AddPlanButton = styled(PlanItem)`
  align-items: center;
  justify-content: center;

  font-size: 30pt;
  font-weight: 200;
`;

const Project = () => {
  return (
    <PlanHeader>
      <SearchableOptionDiv>
        <Search type="text" />

        <OrderDiv>
          <SelectItem elements={orderProps} selectState={orderState} />
        </OrderDiv>

        <SearchButton>검색</SearchButton>
      </SearchableOptionDiv>

      <PlanDiv>
        <PlanButton>
          <PlanTitle>프로젝트 이름</PlanTitle>
          <>대충 규모 / </>
          <>개인이나 팀 / </>
          <>대충 요약</>
        </PlanButton>
        <AddPlanButton>+</AddPlanButton>
      </PlanDiv>
    </PlanHeader>
  );
};

export default Project;
