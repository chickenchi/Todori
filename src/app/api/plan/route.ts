import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const planData = await req.json(); // 요청 데이터 받기
    console.log("Received Data:", planData); // 디버깅용 로그 추가

    const newPlan = await prisma.plan.create({
      data: {
        title: planData.title,
        planType: planData.planType,
        ...(planData.deadline !== undefined && { deadline: new Date(planData.deadline) }),
        startTime: new Date(planData.startTime),
        ETC: planData.ETC,
        difficulty: Number(planData.difficulty),
        penalty: planData.penalty,
        reward: planData.reward,
        descType: planData.descType,
        started: planData.started,
        completed: false,
        ...(planData.periodicType && { periodicType: planData.periodicType }),
        ...(planData.days && { days: planData.days }),
        ...(planData.interval && { interval: planData.interval }),
        ...(planData.alternative && { alternative: planData.alternative }),
      },
    });

    console.log("Inserted Data:", newPlan); // 데이터 삽입 후 확인
    return NextResponse.json(newPlan, { status: 200 });
  } catch (error) {
    console.error("Database Insertion Error:", error); // 오류 상세 로그
    return NextResponse.json({ error: "Error creating plan", details: error }, { status: 500 });
  }
}
