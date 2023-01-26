import { identity } from "@deso-core/identity";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Nav } from "../components/nav";
import { UserContext } from "../contexts";

export const Root = () => {
  const [userState, setUserState] = useState({
    user: null,
    isLoadingUser: false,
  });

  useEffect(
    () =>
      // Typically, you will want access to the current user throughout your
      // app. Here we subscribe to identity at the root of our app so that we
      // can access the current user in any component and our components will
      // re-render when the current user changes. We can access the current
      // user via the useContext hook from anywhere in our app.
      //
      // example:
      //    const { loggedInUser } = useContext(AppContext);
      //
      // See src/components/nav.jsx for an concrete use case.
      identity.subscribe((state) => {
        if (!state.currentUser) {
          // if no user is logged in or the user has logged out, set our app user state to null
          // All of our components will re-render and update accordingly
          setUserState({ user: null });
        } else if (
          state.currentUser?.publicKey !== userState.loggedInUser?.publicKey
        ) {
          // if the user is logged in, fetch the user's details from a node and set the app user state
          // All of our components will re-render and update accordingly
          fetchLoggedInUser().then((loggedInUser) => {
            setUserState({ user: loggedInUser });
          });
        }
      }),
    [] /* NOTE: We pass an empty array to useEffect so that it only runs once for our entire app session */
  );

  return (
    <UserContext.Provider value={userState}>
      <Nav />
      <div role="main">
        <Outlet />
      </div>
    </UserContext.Provider>
  );
};

function fetchLoggedInUser() {
  // We are using native browser fetch here but feel free to use any HTTP client you prefer.
  return fetch(`https://node.deso.org/api/v0/get-users-stateless`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      PublicKeysBase58Check: [identity.currentUser.publicKey],
    }),
  })
    .then((res) => res.json())
    .then(({ UserList }) => UserList[0]);
}
