import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchSystemConfig } from "@/redux/slices/configSlice";
import { useEffect } from "react";

export const useSystemConfig = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { systemConfig, loading, error } = useSelector(
    (state: RootState) => state.config
  );

  useEffect(() => {
    dispatch(fetchSystemConfig());
  }, [dispatch]);

  return { systemConfig, loading, error };
};
