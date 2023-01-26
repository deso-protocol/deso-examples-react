import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  isLoadingUser: false,
});
