import { Welcome } from "../components/Welcome";
import { SignAndSubmitTx } from "../routes/sign-and-submit-tx";
import { Space, Tabs } from "@mantine/core";
import { HotFeed } from "../components/HotFeed";
import { FollowerFeed } from "../components/FollowerFeed";
import { useState } from "react";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("first");

  return (
    <>
      <Space h="md" />
      <SignAndSubmitTx />
      <Space h="md" />
      <Welcome />
      <Space h="md" />
      <Tabs
        variant="pills"
        radius="md"
        value={activeTab}
        onTabChange={setActiveTab}
      >
        <Tabs.List position="center">
          <Tabs.Tab value="first">Hot Feed</Tabs.Tab>
          <Tabs.Tab value="second">Follower Feed</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="first">
          <HotFeed />
        </Tabs.Panel>
        <Tabs.Panel value="second">
          <FollowerFeed />
        </Tabs.Panel>
      </Tabs>
      <Space h="md" />
    </>
  );
};
