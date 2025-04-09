import { viewDetailPlan } from "../plan/tools/common/ViewDetailPlan";

export const viewDetail = async (pid: number) => {
    const result = await viewDetailPlan(pid);
    return result[0];
};