import {
  periodicityProps,
  targetProps,
  typeProps,
} from "@/app/components/select/props/SelectProps";
import { atom } from "jotai";

export const isPlanPopupOpenState = atom<boolean>(false);

export const updateState = atom<boolean>(false);
export const containerUpdateState = atom<number | null>(null);

//

export const planPopupTypeState = atom<string>("");

//

export const planIdState = atom<number | null>(null);

export const detailState = atom<
  | {
      pid: number;
      title: string;
      planType: string;
      deadline: string;
      startTime: string;
      ETC: string;
      difficulty: number;
      penalty: string;
      reward: string;
      started: boolean;
      completed: boolean;
      descType: string;
      plandescription: [
        {
          pid: number;
          pdescId: number;
          description: string;
          seq: string;
          completed: boolean;
        },
        {
          pid: number;
          pdescId: number;
          description: string;
          seq: string;
          completed: boolean;
        }
      ];
    }
  | undefined
>();

export const planOrderState = atom<number>(1);

export const planTitleState = atom<string>("");
export const planTypeState = atom<keyof typeof typeProps>("procedure");
export const planPeriodicityState = atom<keyof typeof periodicityProps>("week");
export const planTargetState = atom<keyof typeof targetProps>("routine");
export const planDeadlineState = atom<string>("");

export const planStartTimeState = atom<string>("");
export const planImmediateStartState = atom<boolean>(false);

export const planProceduresState = atom<string[]>([""]);
export const planSuppliesState = atom<Set<Record<string, number>>>(
  new Set<Record<string, number>>()
);
export const planRangesState = atom<string>("");
export const planTextState = atom<string>("");

export const planETCState = atom<string>("");
export const planDifficultyState = atom<number | undefined>(undefined);

export const planPenaltyState = atom<string>("");
export const planRewardState = atom<string>("");
