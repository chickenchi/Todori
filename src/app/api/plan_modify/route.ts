import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const planData = await req.json();
    console.log("Received Data:", planData);

    if (!planData.pid) {
      return NextResponse.json(
        { error: "Missing plan ID for update." },
        { status: 400 }
      );
    }

    const updatedPlan = await prisma.plan.update({
      where: { pid: planData.pid },
      data: {
        title: planData.title,
        planType: planData.planType,
        deadline: new Date(planData.deadline),
        startTime: planData.startTime,
        ETC: planData.ETC,
        difficulty: Number(planData.difficulty),
        penalty: planData.penalty,
        reward: planData.reward,
        descType: planData.descType,
        completed: planData.completed ?? false,
      },
    });

    console.log("Updated Plan:", updatedPlan);
    return NextResponse.json(updatedPlan, { status: 200 });
  } catch (error) {
    console.error("Database Update Error:", error);
    return NextResponse.json({ error: "Error updating plan", details: error }, { status: 500 });
  }
}
