import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pid, pdescId, completed } = body;

    if (typeof pid !== "number" || typeof pdescId !== "number" || typeof completed !== "boolean") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const updatedPlan = await prisma.plandescription.update({
      where: { pid, pdescId },
      data: { completed },
    });

    console.log(completed)
    return NextResponse.json({ success: true, updatedPlan }, { status: 200 });
  } catch (error) {
    console.error("Database Update Error:", error);
    return NextResponse.json({ error: "Error updating plan", details: error }, { status: 500 });
  }
}
