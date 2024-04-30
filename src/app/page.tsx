"use client";

import { Each } from "@/components/each";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<null | {
    surveys: SurveyType[];
    surveyDetails: {
      [key: string]: SurveyDetail;
    };
    user: User;
    token: string;
  }>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      axios
        .get("/api/survey", {
          params: {
            search: search.trim(),
          },
        })
        .then(({ data }) => {
          setData((prev) => {
            return prev
              ? {
                  ...prev,
                  surveys: data.data,
                }
              : null;
          });
        })
        .catch(() => {
          console.log("Something went wrong while searching");
        });
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  const fetchLocation = async () => {
    try {
      if (data) {
        return;
      }
      const { data: ipResponse } = await axios.get(
        "https://api.ipify.org?format=json"
      );
      const { ip } = ipResponse;

      if (ip) {
        const { data: locationResponse } = await axios.get(
          `https://ipinfo.io/${ip}/json`
        );
        const location: LocationType = {
          city: locationResponse.city,
          country: locationResponse.country,
          ip: locationResponse.ip,
          loc: locationResponse.loc,
          postal: locationResponse.postal,
          state: locationResponse.region,
        };

        const { data } = await axios.get("/api/auth/verify", {
          headers: {
            Authorization: "Bearer " + JSON.stringify(location),
          },
        });
        setData(data.data[0]);
      }
    } catch (error) {
      console.log("Something went wrong while verifying");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const castVote = async (id: string, option: string) => {
    if (
      data?.surveyDetails &&
      data.surveyDetails[id] &&
      data.surveyDetails[id].cast
    ) {
      const castVoteResponse = await axios.post("/api/vote", {
        surveyId: id,
        option,
        token: data.token,
      });
      setData((prev) => {
        return prev
          ? {
              ...prev,
              surveyDetails: {
                ...prev.surveyDetails,
                [id]: castVoteResponse.data.data[0],
              },
            }
          : null;
      });
    }
  };

  const searchHandler = (e: any) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Survey</h1>
        <input
          className="bg-transparent px-4 py-1"
          placeholder="search.."
          onChange={searchHandler}
        />
      </div>
      <Each
        of={data?.surveys || []}
        render={(survey) => {
          const asset = survey.Asset?.[0];
          const details = data?.surveyDetails[survey.id];
          return (
            <div className="border-b-[1px] border-[#ccc]  py-4 border-solid">
              <div className="font-bold text-sm lg:text-lg  pb-2">
                {survey.title}
              </div>
              {asset && (
                <Image
                  src={asset.src}
                  alt={asset.id}
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-md"
                />
              )}
              <Each
                of={survey.options}
                render={(option) => {
                  return (
                    <div
                      onClick={() => {
                        castVote(survey.id, option);
                      }}
                      className={`text-sm md:text-md font-bold  cursor-pointer border-[1px] flex justify-between items-center rounded-md my-2 px-4 py-2 border-solid ${
                        details?.value == option
                          ? "border-green-500 text-green-500"
                          : "border-[#ccc]"
                      }`}
                    >
                      <p>{option}</p>
                      {details?.result && (
                        <p className="">{details.result[option] * 100}%</p>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
