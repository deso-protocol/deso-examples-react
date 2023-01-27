import { identity } from "@deso-core/identity";
import { useContext } from "react";
import { UserContext } from "../contexts";

export const SignAndSubmitTx = () => {
  const { currentUser: user } = useContext(UserContext);
  const username =
    user?.ProfileEntryResponse?.Username ?? user?.PublicKeyBase58Check;

  if (!username) {
    return (
      <button onClick={() => identity.login()}>Login to create a post</button>
    );
  }

  return (
    <>
      <h1>Submit a signed post transaction</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          // check if the user can make a post
          if (
            !identity.hasPermissions({
              TransactionCountLimitMap: {
                SUBMIT_POST: 1,
              },
            })
          ) {
            // if the user doesn't have permissions, request them
            identity.requestPermissions({
              GlobalDESOLimit: 10000000, // 0.01 DESO
              TransactionCountLimitMap: {
                SUBMIT_POST: 3,
              },
            });
            return;
          }

          const body = e.target[0].value;

          const createTx = () =>
            fetch("https://node.deso.org/api/v0/submit-post", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                UpdaterPublicKeyBase58Check: identity.activePublicKey,
                BodyObj: {
                  Body: body,
                  ImageURLs: [],
                  VideoURLs: [],
                },
                MinFeeRateNanosPerKB: 1000,
              }),
            }).then((res) => res.json());

          identity
            .signAndSubmitTx(createTx)
            .then(() => alert("Post submitted successfully!"))
            .catch((e) =>
              alert(`Error submitting post. Please try again. ${e.toString()}`)
            );
        }}
      >
        <textarea
          name="post-textarea"
          cols={30}
          rows={10}
          style={{ border: "1px solid black" }}
        ></textarea>
        <div>
          <button>Post</button>
        </div>
      </form>
    </>
  );
};
