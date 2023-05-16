import { Welcome } from "../components/Welcome";
import { SignAndSubmitTx } from "../routes/sign-and-submit-tx";

export const Home = () => {
  return (
    <>
      <Welcome />
      <SignAndSubmitTx />
    </>
  );
};
