import prisma from "@/db";

export async function getResults(survey: SurveyType) {
  const votes = await prisma.vote.findMany({
    where: { surveyId: survey.id },
  });
  const result = survey.options.reduce((prev, curr) => {
    prev[curr] = 0;
    return prev;
  }, {} as { [key: string]: number });

  let totalVotes = 0;
  for (const vote of votes) {
    if (typeof result[vote.for] == "number") {
      result[vote.for] += 1;
    }
    totalVotes++;
  }

  for (const vote in result) {
    result[vote] = result[vote] / totalVotes;
  }

  return result;
}
