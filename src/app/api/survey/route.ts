import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const searchText = searchParams.get("search");
  try {
    const surveys = await prisma.survey.findMany({
      where: {
        title: {
          contains: searchText || "",
        },
      },
      include: {
        Asset: true,
      },
      take: 15,
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({
      message: "success",
      data: surveys,
    });
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json(
    {
      message: "Something went wrong!",
    },
    { status: 500 }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (
    body.email == process.env.ADMIN_EMAIL &&
    body.password == process.env.ADMIN_PASSWORD
  ) {
    try {
      const survey = await prisma.survey.create({
        data: {
          title: body.title,
          options: body.options,
        },
      });
      if (body.banner) {
        await prisma.asset.create({
          data: {
            src: body.banner,
            surveyId: survey.id,
          },
        });
      }
      return NextResponse.json({ message: "Success" });
    } catch (error) {
      console.log(error);
    }
  }
  return NextResponse.json({}, { status: 500 });
}
