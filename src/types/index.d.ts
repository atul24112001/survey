type LocationType = {
  city: string;
  country: string;
  ip: string;
  loc: string;
  postal: string;
  state: string;
};

type User = {
  id: string;
  ip: string;
  country: string;
  city: string;
  loc: string;
  postal: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
};

type SurveyDetail = {
  cast: boolean;
  result?: { [key: string]: number };
  value?: string;
};

type VoteType = {
  id: string;
  for: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  surveyId: string;
};

type Asset = {
  id: string;
  src: string;
  createdAt: Date;
  updatedAt: Date;
  surveyId: string;
};

type SurveyType = {
  id: string;
  title: string;
  options: string[];
  createdAt: Date;
  updatedAt: Date;
  Vote?: VoteType[];
  Asset?: Asset[];
};
