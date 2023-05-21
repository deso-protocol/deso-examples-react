import { identity } from "deso-protocol";
import { useContext } from "react";
import { UserContext } from "../contexts";
import { getDisplayName } from "../helpers";

export const SwitchAccount = () => {
  const { currentUser, alternateUsers, isLoading } = useContext(UserContext);

  if (!currentUser) {
    return (
      <>
        <p>You need to login in with more than one user to start switching</p>
        <h1>Login to get started</h1>
        <button onClick={() => identity.login()}>Add </button>
      </>
    );
  }

  if (currentUser && !alternateUsers?.length) {
    return (
      <>
        
        <button onClick={() => identity.login()}>Add an account</button>
      </>
    );
  }

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <p>
          You are currently logged in as{" "}
          {currentUser.ProfileEntryResponse?.Username ??
            currentUser.PublicKeyBase58Check}
        </p>
      )}
      <button onClick={() => identity.login()}>Add another account</button>
      <h1>Switch to another account</h1>
      <ul className="switch-account__list list--unstyled">
        {alternateUsers?.map((user) => (
          <li key={user.PublicKeyBase58Check}>
            <button
              className="switch-account__button"
              onClick={() => identity.setActiveUser(user.PublicKeyBase58Check)}
            >
              {getDisplayName(user)}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
