import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchBusinessConfig } from "@/redux/slices/configSlice";
import { useEffect } from "react";

export const useBusinessConfig = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { businessConfig, loading, error } = useSelector(
    (state: RootState) => state.config
  );

  useEffect(() => {
    dispatch(fetchBusinessConfig());
  }, [dispatch]);

  return { businessConfig, loading, error };
};
