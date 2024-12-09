import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authenticate } from "./features/auth/authSlice";
import AppRouter from "./routes/AppRouter";
import axios from "axios";
import { useTheme } from "./utils/themes.utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useTheme();

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
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`theme-${theme}`}>
      <AppRouter />
      <ToastContainer />
    </div>
  );
};

export default App;
