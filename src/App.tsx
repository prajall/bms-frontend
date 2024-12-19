import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import { authenticate } from "./features/auth/authSlice";
import { fetchSystemConfig, fetchBusinessConfig } from "./redux/slices/configSlice";
import AppRouter from "./routes/AppRouter";
import axios from "axios";
import { useTheme } from "./utils/themes.utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleUpdater from "./components/admin/Header/HeaderTitle";
import { useBusinessConfig } from "./hooks/useBusinessConfig";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { businessConfig, loading, error } = useBusinessConfig();

  useEffect(() => {
    if (businessConfig) {
      // Dynamically update the title
      document.title = businessConfig?.businessName || "Product Service Management System";

      // Dynamically update the favicon
      const favicon = document.getElementById("favicon") as HTMLLinkElement;
      if (favicon && businessConfig?.favicon) {
        favicon.href = businessConfig.favicon;
      }
    }
  }, [businessConfig]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/info`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const userData = response.data?.data;
        if (userData) {
          console.log("Authenticate");
          dispatch(authenticate(userData));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
    fetchUser();
    dispatch(fetchSystemConfig()); 
    dispatch(fetchBusinessConfig()); 
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`theme-${theme} font-poppins`}>
      <AppRouter />

      <ToastContainer />
    </div>
  );
};

export default App;
