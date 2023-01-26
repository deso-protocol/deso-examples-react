import { useParams } from "react-router-dom";

export const User = () => {
  const { username } = useParams();

  return <div>{username}</div>;
};
