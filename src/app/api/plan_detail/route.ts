import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pid = Number(searchParams.get("pid")); // URL에서 pid 가져오기

    if (!pid) {
      return NextResponse.json({ error: "Missing pid parameter" }, { status: 400 });
    }

    const plan = await prisma.plan.findMany({
      where: { pid },
      select: {
        pid: true,
        title: true,
        planType: true,
        deadline: true,
        startTime: true,
        ETC: true,
        difficulty: true,
        penalty: true,
        reward: true,
        completed: true,
        descType: true,
        
        plandescription: {
          select: {
            pid: true,
            pdescId: true,
            description: true,
            seq: true,
            completed: true,
          },
        },
      },
    });
    

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    console.log("Fetched Data:", plan);
    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json({ error: "Error fetching plan", details: error }, { status: 500 });
  }
}
