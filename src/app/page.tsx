"use client";

import { currentExpState, maxExpState } from "@/atoms/common/EXPState";
import Image from "next/image";
import { useAtom } from "jotai";
import styled from "styled-components";

const MainHeader = styled.header`
  display: flex;
`;

const CharacterDiv = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
`;

const GrowthDiv = styled.div`
  display: flex;
  align-items: center;
`;

const Level = styled.p`
  margin-right: 10px;
`;

const EXPDiv = styled.div`
  display: flex;
  width: 200px;
`;

const EXPProgress = styled.div<{ currentExp: number; maxExp: number }>`
  background-color: skyblue;

  ${({ currentExp, maxExp }) => `
    width: ${(currentExp / maxExp) * 100}%;
  `}

  height: 20px;
`;

const EXPBar = styled.div<{ currentExp: number; maxExp: number }>`
  background-color: black;

  ${({ currentExp, maxExp }) => `
    width: ${((maxExp - currentExp) / maxExp) * 100}%;
  `}

  height: 20px;
`;

const DashboardDiv = styled.div`
  width: 350px;
  height: 350px;

  padding: 10px;

  border: 1px solid black;
  border-radius: 10px;
`;

const DashboardTitle = styled.h2``;

const PlanDiv = styled(DashboardDiv)``;
const PlanTitle = styled(DashboardTitle)``;
const Plan = styled.div`
  width: 100%;
  height: 40px;

  border: 1px solid black;

  display: flex;
  align-items: center;
`;

const ScheduleDiv = styled(DashboardDiv)``;
const ScheduleTitle = styled(DashboardTitle)``;
const Schedule = styled.div`
  width: 100%;
  height: 200px;

  border: 1px solid black;
`;

const ProjectDiv = styled(DashboardDiv)``;
const ProjectTitle = styled(DashboardTitle)``;
const Project = styled.div`
  width: 100%;
  height: 200px;

  border: 1px solid black;
`;

const Main = () => {
  const [currentExp] = useAtom(currentExpState);
  const [maxExp] = useAtom(maxExpState);

  return (
    <MainHeader>
      <CharacterDiv>
        <Image src="/character.png" alt="캐릭터" width={300} height={300} />

        <GrowthDiv>
          <Level>Lv. 1</Level>
          <EXPDiv>
            <EXPProgress currentExp={currentExp} maxExp={maxExp} />
            <EXPBar currentExp={currentExp} maxExp={maxExp} />
          </EXPDiv>
        </GrowthDiv>
      </CharacterDiv>

      <PlanDiv>
        <PlanTitle>최근 계획</PlanTitle>

        <Plan>삐슝빠슝</Plan>
      </PlanDiv>

      <ScheduleDiv>
        <ScheduleTitle>일정표</ScheduleTitle>

        <Schedule>대충 달력</Schedule>
      </ScheduleDiv>

      <ProjectDiv>
        <ProjectTitle>프로젝트</ProjectTitle>

        <Project>삐슝빠슝슝</Project>
      </ProjectDiv>
    </MainHeader>
  );
};

export default Main;
