import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const order = searchParams.get("order");
    
    const whereCondition = query
      ? { title: { contains: query } } 
      : {};

    let orderBy: any[] = []; 

    if (order === "newest") {
      orderBy = [{ pid: "desc" }]; 
    } else if (order === "priority") {
      orderBy = [
        { deadline: "asc" },
        { ETC: "asc" },       
        { difficulty: "asc" }, 
      ];
    } else if (order === "deadline") {
      orderBy = [{ deadline: "asc" }]; 
    }

    const plans = await prisma.plan.findMany({
      where: whereCondition,
      orderBy,
      include: {
        plandescription: {
          select: {
            completed: true,
          },
        },
      },
    });

    
    if (plans.length === 0) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    
    console.log("Fetched Data:", plans);
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json({ error: "Error fetching plan", details: error }, { status: 500 });
  }
}
