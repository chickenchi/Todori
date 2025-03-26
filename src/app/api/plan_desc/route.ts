import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const planDescData = await req.json(); 
    console.log("Received Data:", planDescData);

    const newPlanDescription = await prisma.plandescription.create({
      data: {
        pid: planDescData.pid,
        description: planDescData.description,
        completed: false,
        seq: planDescData.seq
      },
    });

    console.log("Inserted Data:", newPlanDescription);
    return NextResponse.json(newPlanDescription, { status: 200 });
  } catch (error) {
    console.error("Database Insertion Error:", error);
    return NextResponse.json({ error: "Error creating plan description", details: error }, { status: 500 });
  }
}
