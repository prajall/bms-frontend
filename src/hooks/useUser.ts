import { useSelector } from "react-redux";
import {RootState } from "@/redux/store";

export const useUser = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  return { isAuthenticated, user };
};
