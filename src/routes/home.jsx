import { Welcome } from "../components/Welcome";
import { SignAndSubmitTx } from "../routes/sign-and-submit-tx";
import {
  Space,
  Tabs,
  Divider,
  Text,
  UnstyledButton,
  Center,
  Paper,
} from "@mantine/core";
import { HotFeed } from "../components/HotFeed";
import { FollowerFeed } from "../components/FollowerFeed";
import { useState } from "react";
import { GiWaveCrest } from "react-icons/gi";
import { IconCampfire, IconUsers } from "@tabler/icons-react";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("third");

  return (
    <>
      <Space h="md" />
      <SignAndSubmitTx />
      <Space h="md" />
      <Welcome />
      <Space h="md" />
      <Divider size="sm" />
      <Space h="md" />
      <Tabs
        variant="pills"
        radius="md"
        value={activeTab}
        onTabChange={setActiveTab}
      >
        <Tabs.List position="center">
          <Tabs.Tab value="first">
            <Center>
              <GiWaveCrest size="1.2rem" />
            </Center>
            <Text fz="sm">Waves</Text>
          </Tabs.Tab>
          <Tabs.Tab value="second">
            <Center>
              <IconUsers />
            </Center>
            <Text fz="sm">Follower Feed</Text>
          </Tabs.Tab>
          <Tabs.Tab value="third">
            <Center>
              <IconCampfire />
            </Center>
            <Text fz="sm">Hot Feed</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="first">
          <Space h={222} />
          <Center>
            <Paper shadow="xl" radius="lg" p="xl" withBorder>
              <Text
                size="xl"
                lineClamp={4}
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              >
                Coming soon
              </Text>
            </Paper>
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
