import { getResults } from "@/components/fuctions";
import prisma, { verifyToken } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const user: any = verifyToken(body.token);
    const survey = await prisma.survey.findFirst({
      where: {
        id: body.surveyId,
      },
    });
    if (survey && survey?.options.includes(body.option)) {
      const vote = await prisma.vote.create({
        data: {
          for: body.option,
          surveyId: survey.id,
          userId: user.id,
        },
      });

      const data: SurveyDetail = {
        cast: false,
        result: await getResults(survey),
        value: vote.for,
      };
      return NextResponse.json({ message: "Success", data: [data] });
    }
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
