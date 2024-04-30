import { getResults } from "@/components/fuctions";
import prisma, { encryptToken } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1] || "";
    const location: LocationType = JSON.parse(token);

    let user: null | User = null;
    user = await prisma.user.findFirst({
      where: location,
    });

    if (!user) {
      user = await prisma.user.create({
        data: location,
      });
    }

    if (user) {
      const responseData: {
        [key: string]: SurveyDetail;
      } = {};
      const surveys = await prisma.survey.findMany({
        include: {
          Vote: {
            where: {
              userId: user.id,
            },
          },
          Asset: true,
        },
        take: 15,
        orderBy: {
          createdAt: "desc",
        },
      });
      for (const survey of surveys) {
        if (survey.Vote.length === 0) {
          responseData[survey.id] = {
            cast: true,
            result: undefined,
          };
        } else {
          const result = await getResults(survey);
          responseData[survey.id] = {
            cast: false,
            result,
            value: survey.Vote[0].for,
          };
        }
      }

      const token = encryptToken({
        id: user.id,
      });
      const responseObject = {
        surveys,
        surveyDetails: responseData,
        user,
        token,
      };
      return NextResponse.json({
        message: "Success",
        data: [responseObject],
      });
    }
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json(
    {
      message: "Something went wrong",
      data: [],
    },
    { status: 500 }
  );
}
