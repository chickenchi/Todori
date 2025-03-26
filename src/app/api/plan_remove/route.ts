import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pid } = body;


    if (typeof pid !== "number") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // 트랜잭션을 사용하여 두 delete 작업을 함께 처리
    const result = await prisma.$transaction([
      prisma.plandescription.deleteMany({
        where: { pid },
      }),
      prisma.plan.delete({
        where: { pid },
      }),
    ]);

    // 성공적인 응답 반환
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Database Update Error:", error);
    return NextResponse.json({ error: "Error updating plan", details: error }, { status: 500 });
  }
}
