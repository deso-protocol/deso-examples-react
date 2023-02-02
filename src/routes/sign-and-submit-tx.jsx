import { ERROR_TYPES, identity } from "@deso-core/identity";
import { useContext } from "react";
import { UserContext } from "../contexts";

export const SignAndSubmitTx = () => {
  const { currentUser, isLoading } = useContext(UserContext);

  let hasPostingPermissions = identity.hasPermissions({
    TransactionCountLimitMap: {
      SUBMIT_POST: 1,
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || !currentUser.BalanceNanos) {
    return (
      <button
        onClick={() => {
          identity
            .login({
              getFreeDeso: true,
            })
            .catch((err) => {
              if (err?.type === ERROR_TYPES.NO_MONEY) {
                alert("You need DESO in order to post!");
              } else {
                alert(err);
              }
            });
        }}
      >
        Login to create a post
      </button>
    );
  } else {
    return (
      <>
        <h1>Submit a signed post transaction</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            // check if the user can make a post
            if (!hasPostingPermissions) {
              // if the user doesn't have permissions, request them
              // and abort the submit
              identity.requestPermissions({
                GlobalDESOLimit: 10000000, // 0.01 DESO
                TransactionCountLimitMap: {
                  SUBMIT_POST: 3,
                },
              });
              return;
            }

            const body = e.target[0].value;

            const tx = await fetch("https://node.deso.org/api/v0/submit-post", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
                BodyObj: {
                  Body: body,
                  ImageURLs: [],
                  VideoURLs: [],
                },
                MinFeeRateNanosPerKB: 1000,
              }),
            }).then((res) => res.json());

            identity
              .signAndSubmit(tx)
              .then(() => alert("Post submitted successfully!"))
              .catch((e) =>
                alert(
                  `Error submitting post. Please try again. ${e.toString()}`
                )
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
  }
};
