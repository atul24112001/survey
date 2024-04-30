"use client";

import { Button } from "@/components/Buttton";
import { Input } from "@/components/Input";
import { Each } from "@/components/each";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [details, setDetails] = useState({
    title: "",
    options: [""],
  });
  const [banner, setBanner] = useState<null | string>(null);

  const addOptionHandler = () => {
    setDetails((prev) => {
      return {
        ...prev,
        options: [...prev.options, ""],
      };
    });
  };

  const addSurveyHandler = async () => {
    await axios.post("/api/survey", {
      ...details,
      ...creds,
      banner,
    });
  };

  const handleAuthFormChange = (e: any) => {
    setCreds((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const adminAuthHandler = async () => {
    await axios.post("/api/auth/admin", creds);
    setIsAdmin(true);
  };

  return (
    <main>
      {!isAdmin ? (
        <>
          <Input
            name="email"
            onChange={handleAuthFormChange}
            placeholder="Please enter email"
            title="Email"
            value={creds.email}
            errorText=""
          />
          <Input
            name="password"
            onChange={handleAuthFormChange}
            placeholder="******"
            title="Password"
            value={creds.password}
            errorText=""
          />
          <div className="my-6 flex justify-end">
            <Button onClick={adminAuthHandler}>Login</Button>
          </div>
        </>
      ) : (
        <>
          <Input
            name="title"
            onChange={(e) => {
              setDetails((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
            placeholder="Please enter title"
            title="Title"
            value={details.title}
            errorText=""
          />
          {banner ? (
            <Image
              width={500}
              height={500}
              className="w-full h-auto my-3"
              src={banner}
              alt="banner"
            />
          ) : (
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();

                  reader.onload = (event) => {
                    if (typeof event?.target?.result == "string") {
                      setBanner(event?.target?.result || null);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
              name=""
              placeholder=""
              title="Banner"
            />
          )}
          <div className="flex justify-between items-center">
            <p className="text-sm">Options</p>{" "}
            <Button onClick={addOptionHandler}>Add</Button>
          </div>
          <Each
            of={details.options}
            render={(option, index) => {
              return (
                <Input
                  name={`Option ${index + 1}`}
                  onChange={(e) => {
                    setDetails((prev) => {
                      const options = prev.options;
                      options[index] = e.target.value;
                      return {
                        ...prev,
                        options,
                      };
                    });
                  }}
                  placeholder={`Option ${index + 1}`}
                  title={``}
                  value={details.options[index]}
                  errorText=""
                />
              );
            }}
          />
          <div className="my-6 flex justify-end">
            <Button onClick={addSurveyHandler}>Add Survey</Button>
          </div>
        </>
      )}
    </main>
  );
}
