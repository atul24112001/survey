import { isAdminLogin } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const creds = await req.json();
  if (
    creds.email == process.env.ADMIN_EMAIL &&
    creds.password == process.env.ADMIN_PASSWORD
  ) {
    globalThis.isAdminLoginGlobal = true;
    return NextResponse.json({
      message: "Success",
      data: [],
    });
  }
  return NextResponse.json(
    {
      message: "Something went wrong",
      data: [],
    },
    { status: 500 }
  );
}
