import { SignAndSubmitTx } from "../routes/sign-and-submit-tx";
import { Space, Tabs, Text, Center, Paper, Badge } from "@mantine/core";
import { HotFeed } from "../components/HotFeed";
import { FollowerFeed } from "../components/FollowerFeed";
import { useState } from "react";
import { BsFire } from "react-icons/bs";
import { GiWaveCrest } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("third");

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
          <Space h={77} />
          <Center>
            <Badge
              size="md"
              radius="sm"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            >
              Coming Soon
            </Badge>
          </Center><Center>
            <Badge
              size="md"
              radius="sm"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            >
              Coming Soon
            </Badge>
          </Center>
          <Space h={222} />
        </Tabs.Panel>
        <Tabs.Panel value="second">
          <FollowerFeed />
        </Tabs.Panel>
        <Tabs.Panel value="third">
          <HotFeed />
        </Tabs.Panel>
      </Tabs>

      <Space h="md" />
    </>
  );
};
