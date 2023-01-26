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
      {!!profile && profile.Username}
      {!user && <button onClick={() => identity.login()}>Login</button>}
      {!!user && <button onClick={() => identity.logout()}>Logout</button>}
      <Link to="/">Home</Link>
      <Link to="/create-post">Create Post</Link>
    </nav>
  );
};
