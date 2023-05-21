import { Welcome } from "../components/Welcome";
import { SignAndSubmitTx } from "../routes/sign-and-submit-tx";
import { Space } from "@mantine/core";
import { HotFeed } from "../components/HotFeed";
export const Home = () => {
  return (
    <>
      <Space h="md" />
      <SignAndSubmitTx />
      <Space h="md" />
      <Welcome />
      <Space h="md" />
      <HotFeed />
    </>
  );
};
