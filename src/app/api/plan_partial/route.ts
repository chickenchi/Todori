import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 요청 본문(body)에서 데이터를 받음
    const body = await req.json();
    const { pdescId, seq } = body; // pid와 completed는 요청 본문에서 받음

    // pid와 completed가 유효한지 확인
    if (typeof pdescId !== "number" || typeof seq !== "number") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // 데이터베이스에서 해당 plan을 업데이트
    const updatedPlan = await prisma.plandescription.update({
      where: { pdescId },
      data: { seq },
    });

    // 성공적인 응답 반환
    return NextResponse.json({ success: true, updatedPlan }, { status: 200 });
  } catch (error) {
    console.error("Database Update Error:", error);
    return NextResponse.json({ error: "Error updating plan", details: error }, { status: 500 });
  }
}
