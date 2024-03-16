"use client";

import MainLayout from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { se } from "@/lib/utils";
import { useState } from "react";

export default function AdSpace() {
  const [link, setLink] = useState("");
  return (
    <MainLayout>
      <div className="mt-5 flex w-full flex-col gap-8">
        <div className="flex w-full items-center justify-between p-2">
          <div className="grid items-start gap-2">
            <Title>Ad space</Title>
            <SubTitle>Ad space that displays on the mobile app</SubTitle>
          </div>
          <Button>Update</Button>
        </div>
        <div className="grid w-full items-center justify-start">
          <Input
            name="link"
            type="text"
            placeholder="Enter banner link"
            value={link}
            onChange={(e) => setLink(e.currentTarget.value)}
          />
        </div>
      </div>
    </MainLayout>
  );
}

const Title = se("p", "text-3xl font-medium text-white");
const SubTitle = se("span", "text-sm font-normal text-white");
