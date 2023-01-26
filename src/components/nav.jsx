import { identity } from "@deso-core/identity";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts";

export const Nav = () => {
  const { user } = useContext(UserContext);
  // NOTE: A user may have created an anonymous account, but not yet filled in their profile details
  // All apps will need to take this into account.
  const profile = user?.ProfileEntryResponse;

  return (
    <nav>
      <Link to="/">Home</Link>
      {!user && <button onClick={() => identity.login()}>Login</button>}
      {!!user && <button onClick={() => identity.logout()}>Logout</button>}
      {!!profile && profile.Username}
    </nav>
  );
};
