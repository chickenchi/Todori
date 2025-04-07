"use client";

import { currentExpState, maxExpState } from "@/atoms/common/EXPState";
import Image from "next/image";
import { useAtom } from "jotai";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { viewDetail } from "./components/common/ViewDetail";
import { loadPlan } from "./components/plan/tools/LoadPlan";
import {
  containerUpdateState,
  detailState,
  updateState,
} from "@/atoms/plan_popup/PlanPopupState";
import PlanContainer from "./components/plan/container/PlanContainer";
import { planComplete } from "./components/plan/tools/PlanComplete";

const MainSection = styled.header`
  position: relative;

  display: flex;
  align-items: center;

  height: 83%;

  gap: 20px;
`;

const CharacterDiv = styled.div`
  margin-left: 50px;
  display: flex;
  flex-direction: column;
`;

const CharacterImage = styled(Image)`
  width: 200px;
  height: 200px;

  margin-bottom: 5px;
`;

const GrowthDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const LevelNameCard = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Level = styled.p`
  margin-right: 10px;

  font-size: 15pt;
`;

const Name = styled.p`
  font-size: 15pt;
`;

const EXP = styled.div`
  border-radius: 3px;
  height: 20px;
`;

const EXPDiv = styled(EXP)`
  background-color: black;
  display: flex;

  width: 200px;

  margin-bottom: 20px;
`;

const EXPProgress = styled(EXP)<{ currentexp: number; maxexp: number }>`
  background-color: skyblue;

  ${({ currentexp, maxexp }) => `
    width: ${(currentexp / maxexp) * 100}%;
  `}

  z-index: 1;
`;

const WarpContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const WarpDiv = styled.div`
  width: 80px;
  height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid black;
  border-radius: 5px;
`;

const ClothesDiv = styled(WarpDiv)`
  margin-right: 20px;
`;

const ShopDiv = styled(WarpDiv)``;

const VerticalLine = styled.div`
  background-color: black;

  width: 1px;
  height: 70%;

  margin-left: auto;
`;

const DashboardDiv = styled.div`
  height: 70%;

  margin-left: 80px;
  margin-right: 50px;
`;

const DashboardTitle = styled.h2``;

const RecentPlanDiv = styled(DashboardDiv)``;
const RecentPlanTitle = styled(DashboardTitle)`
  display: flex;
  align-items: center;
`;
const RecentPlanTitleSVG = styled.svg`
  margin-right: 15px;
`;

const RecentPlanContainer = styled.div`
  height: 370px;

  overflow-x: none;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Plan = styled.div`
  width: 380px;
  height: 100px;

  margin-bottom: 15px;

  padding-left: 15px;

  border: 1px solid black;
  border-radius: 5px;

  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const PlanTitleContainer = styled.div`
  height: 40px;

  margin-bottom: 10px;

  display: flex;
  align-items: center;
`;

const PlanCompleted = styled.div<{ completed: string }>`
  background-color: ${({ completed }) =>
    completed === "true" ? "black" : "rgba(0, 0, 0, 0)"};

  width: 30px;
  height: 30px;

  border: 1px solid black;
  border-radius: 5px;
`;

const PlanTitle = styled.h2<{ type?: string }>`
  ${({ type }) =>
    type === "text" &&
    `
    margin-left: 10px;
  `}

  font-size: 18pt;
`;

const PlanDeadline = styled.p`
  font-size: 12pt;
`;

const Main = () => {
  const [currentExp] = useAtom(currentExpState);
  const [maxExp] = useAtom(maxExpState);
  const [detail, setDetail] = useAtom(detailState);

  const [update, setUpdate] = useAtom(updateState);
  const [containerUpdate, setContainerUpdate] = useAtom(containerUpdateState);

  const [plan, getPlan] = useState<any[]>([]);

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

  const checkingDetail = async (pid: number, completed: boolean) => {
    const planData = {
      pid: pid,
      completed: !completed,
    };

    try {
      await planComplete(planData);
      setUpdate(!update);
    } catch (error) {
      console.error("Error completing plan:", error);
    }
  };

  return (
    <MainSection>
      <CharacterDiv>
        <CharacterImage
          src="/character.png"
          alt="캐릭터"
          width={300}
          height={300}
        />

        <GrowthDiv>
          <LevelNameCard>
            <Level>Lv. 1</Level>
            <Name>선영</Name>
          </LevelNameCard>
          <EXPDiv>
            <EXPProgress currentexp={currentExp} maxexp={maxExp} />
          </EXPDiv>
          <WarpContainer>
            <ClothesDiv>
              <svg width="45" height="30" viewBox="0 0 61 45" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M29.5508 5.05206C27.217 5.05206 25.7151 6.70473 25.7151 8.2904C25.7151 8.84569 25.4945 9.37825 25.1018 9.7709C24.7092 10.1636 24.1766 10.3841 23.6213 10.3841C23.066 10.3841 22.5335 10.1636 22.1408 9.7709C21.7482 9.37825 21.5276 8.84569 21.5276 8.2904C21.5276 3.98285 25.3354 0.864563 29.5508 0.864563C33.7662 0.864563 37.5741 3.98285 37.5741 8.2904C37.5741 10.1887 36.8817 11.9586 35.6478 13.2986C35.257 13.7258 34.8271 14.1501 34.4335 14.5409L34.2269 14.7419C33.7994 15.1571 33.3887 15.5892 32.9957 16.0373C32.787 16.2783 32.5958 16.5339 32.4235 16.8022C34.0354 17.1022 35.5689 17.7292 36.9292 18.6447L57.6797 32.6309C60.3317 34.4176 61.0492 37.3684 60.128 39.8558C59.2207 42.3013 56.8031 44.1354 53.6625 44.1354H7.33474C4.23041 44.1354 1.82399 42.3348 0.897161 39.92C-0.0464221 37.4633 0.617995 34.5293 3.20866 32.7091L23.0155 18.7731C24.4938 17.7375 26.1866 17.0485 27.968 16.7575C28.2611 15.3421 29.0651 14.1948 29.8049 13.3238C30.285 12.7599 30.8099 12.2322 31.2817 11.766L31.505 11.5427C31.9042 11.1519 32.2504 10.8085 32.5658 10.4651C33.0739 9.91235 33.3866 9.1586 33.3866 8.2876C33.3866 6.70473 31.8847 5.05206 29.5508 5.05206ZM34.5898 22.1147C33.2217 21.2083 31.6104 20.739 29.9696 20.7691C28.3456 20.779 26.762 21.277 25.4247 22.1985L5.61787 36.1317C4.65195 36.8101 4.52633 37.6894 4.80829 38.4181C5.10141 39.1858 5.93333 39.9479 7.33474 39.9479H53.6625C55.0834 39.9479 55.9125 39.1746 56.2029 38.3985C56.4737 37.6615 56.3341 36.7738 55.3375 36.1038L34.5898 22.1147Z"
                  fill="black"
                />
              </svg>
            </ClothesDiv>
            <ShopDiv>
              <svg width="43" height="35" viewBox="0 0 58 50" fill="none">
                <path
                  d="M20.4371 37.4811H49.7428C50.7211 37.4811 51.575 36.6775 51.575 35.5975C51.575 34.5175 50.7211 33.7139 49.7428 33.7139H20.8636C19.4321 33.7139 18.5536 32.7089 18.3275 31.1778L17.9257 28.5411H49.7921C53.4586 28.5411 55.3421 26.2803 55.8693 22.69L57.8782 9.40534C57.9321 9.08996 57.9657 8.77145 57.9789 8.45177C57.9789 7.24641 57.0746 6.41713 55.6936 6.41713H14.6868L14.2089 3.22856C13.9582 1.29463 13.2553 0.31427 10.6946 0.31427H1.87891C0.874986 0.31427 0.0210571 1.19498 0.0210571 2.19998C0.0210571 3.22856 0.874986 4.1082 1.87999 4.1082H10.3668L14.3846 31.6803C14.9128 35.2461 16.7953 37.4811 20.4371 37.4811ZM53.7093 10.2089L51.9286 22.2378C51.7271 23.7946 50.8989 24.7493 49.4171 24.7493L17.375 24.7739L15.2396 10.2089H53.7093ZM22.4214 49.6857C22.9569 49.6901 23.4879 49.5879 23.9835 49.385C24.4791 49.1822 24.9293 48.8827 25.3079 48.504C25.6866 48.1254 25.9861 47.6751 26.189 47.1795C26.3919 46.684 26.4941 46.153 26.4896 45.6175C26.492 45.0826 26.3885 44.5525 26.1849 44.0578C25.9813 43.5631 25.6817 43.1137 25.3035 42.7354C24.9252 42.3572 24.4758 42.0576 23.9811 41.854C23.4864 41.6504 22.9563 41.5469 22.4214 41.5493C20.1371 41.5493 18.3286 43.3578 18.3286 45.6175C18.3286 47.9028 20.1371 49.6857 22.4214 49.6857ZM45.9007 49.6857C48.1861 49.6857 49.9936 47.9028 49.9936 45.6175C49.9936 43.3568 48.1861 41.5493 45.9007 41.5493C43.6411 41.5493 41.8078 43.3578 41.8078 45.6175C41.8078 47.9028 43.6411 49.6857 45.9007 49.6857Z"
                  fill="black"
                />
              </svg>
            </ShopDiv>
          </WarpContainer>
        </GrowthDiv>
      </CharacterDiv>

      <VerticalLine />

      <RecentPlanDiv>
        <RecentPlanTitle>
          <RecentPlanTitleSVG
            width="34"
            height="42"
            viewBox="0 0 54 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.6094 0C18.8262 0 18.075 0.311132 17.5212 0.86495C16.9674 1.41877 16.6563 2.16991 16.6563 2.95312C16.6563 3.73634 16.9674 4.48748 17.5212 5.0413C18.075 5.59512 18.8262 5.90625 19.6094 5.90625H33.3906C34.1738 5.90625 34.925 5.59512 35.4788 5.0413C36.0326 4.48748 36.3438 3.73634 36.3438 2.95312C36.3438 2.16991 36.0326 1.41877 35.4788 0.86495C34.925 0.311132 34.1738 0 33.3906 0L19.6094 0ZM46.1875 35.4375C46.1875 40.659 44.1133 45.6665 40.4212 49.3587C36.729 53.0508 31.7215 55.125 26.5 55.125C21.2786 55.125 16.271 53.0508 12.5788 49.3587C8.88671 45.6665 6.8125 40.659 6.8125 35.4375C6.8125 30.216 8.88671 25.2085 12.5788 21.5163C16.271 17.8242 21.2786 15.75 26.5 15.75C31.7215 15.75 36.729 17.8242 40.4212 21.5163C44.1133 25.2085 46.1875 30.216 46.1875 35.4375ZM52.0938 35.4375C52.0938 42.2254 49.3973 48.7353 44.5975 53.535C39.7978 58.3348 33.2879 61.0312 26.5 61.0312C19.7121 61.0312 13.2022 58.3348 8.40249 53.535C3.60273 48.7353 0.90625 42.2254 0.90625 35.4375C0.90625 28.6496 3.60273 22.1397 8.40249 17.34C13.2022 12.5402 19.7121 9.84375 26.5 9.84375C33.2879 9.84375 39.7978 12.5402 44.5975 17.34C49.3973 22.1397 52.0938 28.6496 52.0938 35.4375ZM43.1163 6.7725C43.67 6.21948 44.4205 5.90885 45.2031 5.90885C45.9857 5.90885 46.7363 6.21948 47.29 6.7725L53.1963 12.6788C53.7179 13.2386 54.0019 13.979 53.9884 14.7441C53.9749 15.5091 53.665 16.2391 53.1239 16.7801C52.5828 17.3212 51.8529 17.6311 51.0878 17.6446C50.3227 17.6581 49.5823 17.3741 49.0225 16.8525L43.1163 10.9462C42.5632 10.3925 42.2526 9.64196 42.2526 8.85938C42.2526 8.07679 42.5632 7.32621 43.1163 6.7725ZM29.4531 23.625C29.4531 22.8418 29.142 22.0906 28.5882 21.5368C28.0344 20.983 27.2832 20.6719 26.5 20.6719C25.7168 20.6719 24.9656 20.983 24.4118 21.5368C23.858 22.0906 23.5469 22.8418 23.5469 23.625V35.4375C23.5469 35.896 23.6536 36.3481 23.8586 36.7582C24.0637 37.1682 24.3614 37.5249 24.7281 37.8L29.9768 41.7375C30.6034 42.2074 31.391 42.4092 32.1663 42.2984C32.5502 42.2436 32.9196 42.1137 33.2533 41.9161C33.587 41.7185 33.8785 41.4571 34.1112 41.1469C34.3439 40.8366 34.5132 40.4836 34.6094 40.1079C34.7057 39.7322 34.727 39.3413 34.6721 38.9574C34.6173 38.5735 34.4874 38.2041 34.2898 37.8704C34.0922 37.5367 33.8308 37.2452 33.5206 37.0125L29.4531 33.9609V23.625Z"
              fill="black"
            />
          </RecentPlanTitleSVG>
          최근 미완료 계획
        </RecentPlanTitle>

        <RecentPlanContainer>
          {plan && plan.length > 0 ? (
            plan.map((plan) => {
              return (
                <Plan
                  onClick={async () => {
                    setDetail(await viewDetail(plan.pid));
                  }}
                  key={plan.pid}
                >
                  <PlanTitleContainer>
                    {plan.descType === "text" && (
                      <PlanCompleted
                        completed={`${plan.completed}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            plan.descType === "text" ||
                            plan.descType === "range"
                          ) {
                            checkingDetail(plan.pid, plan.completed);
                          }
                        }}
                      />
                    )}
                    <PlanTitle type={plan.descType}>{plan.title}</PlanTitle>
                  </PlanTitleContainer>
                  <PlanDeadline>
                    ~ {new Date(plan.deadline).toLocaleString()}
                  </PlanDeadline>
                </Plan>
              );
            })
          ) : (
            <Plan>
              <PlanTitle>계획이 없습니다.</PlanTitle>
            </Plan>
          )}
        </RecentPlanContainer>
      </RecentPlanDiv>

      {detail !== undefined && <PlanContainer />}
    </MainSection>
  );
};

export default Main;
