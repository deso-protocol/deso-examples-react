import {
  configure,
  getUsersStateless,
  identity,
  NOTIFICATION_EVENTS,
} from "deso-protocol";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { MantineAppShell } from "../components/AppShell/AppShell";
import { UserContext } from "../contexts";
import { Loader, Center } from "@mantine/core";

configure({
  spendingLimitOptions: {
    GlobalDESOLimit: 10000000, // 0.01 DESO
    TransactionCountLimitMap: {
      SUBMIT_POST: "UNLIMITED",
    },
  },

  appName: "Your Mom's House.",
});

export const Root = () => {
  const [userState, setUserState] = useState({
    currentUser: null,
    alternateUsers: null,
    isLoading: true,
  });

  useEffect(
    () => {
      // Typically, you will want access to the current user throughout your
      // app. Here we subscribe to identity at the root of our app so that we
      // can access the current user in any component and our components will
      // re-render when the current user changes. We can access the current
      // user via the useContext hook from anywhere in our app.
      //
      // example:
      //    const { user } = useContext(UserContext);
      //
      // See src/components/nav.jsx for an concrete use case.
      //
      // NOTE: This function could be chatty. You might want to implement some
      // caching or memoization to reduce unnecessary network calls. We have not
      // done so here for simplicity and to reduce noise from the example.
      identity.subscribe(({ event, currentUser, alternateUsers }) => {
        // The event property tells us what triggered the subscription callback.
        // The authorize derived key flow is a multi-step asynchronous process. We can use the start
        // of this to set our loading state. Once the flow is complete, the end event will be triggered
        // and subscribe will be called again with the new user state. You can see an exhaustive list of
        // events here: https://github.com/deso-protocol/deso-workspace/blob/main/libs/identity/src/lib/types.ts#L182
        // You can filter on any of these events to trigger different actions in your app, or choose to ignore
        // some of them.
        if (event === NOTIFICATION_EVENTS.AUTHORIZE_DERIVED_KEY_START) {
          setUserState((state) => ({ ...state, isLoading: true }));
          return;
        }

        // NOTE: You can use this callback to update your app state in any way you want.
        // Here we just use a simple useState hook combined with react context. You can
        // use redux, mobx, or any other state management library you want.

        // If your app supports multiple accounts for a user and the current user logs out,
        // you can choose a fallback user to use as the current user from the alternateUsers
        // object. This is a choice you can make depending on the requirements of your own app.
        // Here we just choose the first alternate user as the fallback user. Alternate users
        // are all users that have been logged in to your app and never logged out.
        if (alternateUsers && !currentUser) {
          const fallbackUser = Object.values(alternateUsers)[0];
          identity.setActiveUser(fallbackUser.publicKey);
          // NOTE: setting the active user will trigger a new state change in
          // identity which will re-trigger this callback so we just return
          // here.
          return;
        }

        if (!currentUser) {
          // if no user is logged in or the user has logged out, set our app user state to null
          // All of our components will re-render and update accordingly
          setUserState((state) => ({
            ...state,
            currentUser: null,
            isLoading: false,
          }));
        } else if (
          currentUser?.publicKey !== userState.currentUser?.PublicKeyBase58Check
        ) {
          // if the user is logged in, fetch the user's details from a node and set the app user state
          // All of our components will re-render and update accordingly. We also fetch any alternate users
          // we may have stored in local storage.
          const alternateUserKeys =
            Object.values(alternateUsers ?? {})?.map((u) => u.publicKey) ?? [];

          // We set isLoading to true so that we can show a loading indicator wherever
          // we reference the user state in our app.
          setUserState((state) => ({
            ...state,
            isLoading: true,
          }));

          getUsersStateless({
            PublicKeysBase58Check: [
              currentUser.publicKey,
              ...alternateUserKeys,
            ],
            IncludeBalance: true,
          })
            .then(({ UserList }) => {
              const [currentUser, ...alternateUsers] = UserList;
              setUserState((state) => ({
                ...state,
                currentUser,
                alternateUsers,
              }));
            })
            .finally(() =>
              setUserState((state) => ({
                ...state,
                isLoading: false,
              }))
            );
        }
      });
    },
    [] /* NOTE: We pass an empty array to useEffect so that it only runs once for our entire app session */
  );

  return (
    <UserContext.Provider value={userState}>
      <MantineAppShell>
        <div role="main" className="main-content">
          {userState.isLoading ? (
            <Center>
              <Loader variant="bars" />
            </Center>
          ) : (
            <Outlet />
          )}
        </div>
      </MantineAppShell>
    </UserContext.Provider>
  );
};
