import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const plan = await prisma.plan.findMany({
      include: {
        plandescription: {
          select: {
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