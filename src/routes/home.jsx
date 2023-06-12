import { SignAndSubmitTx } from "../routes/sign-and-submit-tx";
import { Space, Tabs, Text, Center, Paper, Badge } from "@mantine/core";
import { HotFeed } from "../components/HotFeed";
import { WavesFeed } from "../components/WavesFeed";
import { FollowerFeed } from "../components/FollowerFeed";
import { useState } from "react";
import { BsFire } from "react-icons/bs";
import { GiWaveCrest } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("first");

  return (
    <>
      <Space h="md" />
      <SignAndSubmitTx />
      <Space h="md" />

      <Space h="md" />
      <Tabs radius="md" value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List position="center">
          <Tabs.Tab value="first">
            <Center>
              <GiWaveCrest size="1.4rem" />
            </Center>
            <Text fz="sm">Waves</Text>
          </Tabs.Tab>

          <Tabs.Tab value="second">
            <Center>
              <FaUsers size="1.4rem" />
            </Center>
            <Text fz="sm">Follower Feed</Text>
          </Tabs.Tab>

          <Tabs.Tab value="third">
            <Center>
              <BsFire size="1.4rem" />
            </Center>
            <Text fz="sm">Hot Feed</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="first">
          
         <WavesFeed />
          <Space h={55} />
        </Tabs.Panel>
        <Tabs.Panel value="second">
          <FollowerFeed />
          <Space h={55} />
        </Tabs.Panel>
        <Tabs.Panel value="third">
          <HotFeed />
          <Space h={55} />
        </Tabs.Panel>
      </Tabs>

      <Space h="md" />
    </>
  );
};
