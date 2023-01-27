import { createContext } from "react";

// This is a simple context that will be used to store and share the state of
// the current user's data. Whether you use react context or redux or something
// else is entirely up to you. The shape of the context is also up to you and
// depends on the specific requirements of your app.
export const UserContext = createContext({
  currentUser: null,
  alternateUsers: null,
  isLoading: false,
});
