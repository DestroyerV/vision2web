import { runCodeAgent } from "@/ai/agent";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, projectId } = body;

    if (!value || typeof value !== "string") {
      return NextResponse.json(
        { error: "Missing required field: value" },
        { status: 400 }
      );
    }

    const result = await runCodeAgent(value.trim(), projectId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error running code agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}