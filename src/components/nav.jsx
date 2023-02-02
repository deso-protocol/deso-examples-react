import { identity } from "@deso-core/identity";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts";
import { getDisplayName } from "../helpers";

export const Nav = () => {
  const { currentUser, isLoading } = useContext(UserContext);

  return (
    <nav className="main-nav">
      <Link to="/">Home</Link>
      <Link to="/sign-and-submit-tx">Sign and Submit Transaction</Link>
      <Link to="switch-account">Switch Accounts</Link>
      <div className="main-nav__user-actions">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {!!currentUser && (
              <span className="main-nav__username">
                {getDisplayName(currentUser)}
              </span>
            )}

            {!currentUser && (
              <button onClick={() => identity.login()}>Login</button>
            )}

            {!!currentUser && (
              <button onClick={() => identity.logout()}>Logout</button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
