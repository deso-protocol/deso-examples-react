import { Welcome } from "../components/Welcome";
import { SignAndSubmitTx } from "../routes/sign-and-submit-tx";
import { Space } from "@mantine/core";

export const Home = () => {
  return (
    <>
      <Space h="md" />
      <SignAndSubmitTx />
      <Space h="md" />
      <Welcome />
    </>
  );
};
