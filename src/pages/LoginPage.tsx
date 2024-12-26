"use client";

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authenticate } from "../features/auth/authSlice";
import { useTheme } from "@/utils/themes.utils";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";
import Logo from "../assets/images/logo.png"
import rb8171 from "../assets/images/rb-817-1.png";
import rb47921 from "../assets/images/rb-4792-1.png";

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const { businessConfig, loading, error } = useBusinessConfig();

  console.log("Theme: ", theme);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status >= 200) {
        dispatch(authenticate(response.data.user));
        toast.success("Logged in successfully");
        navigate("/admin");
      } else {
        throw new Error("Login Error");
      }
    } catch (error: any) {
      if (error.message == "Network Error") {
        toast.error("Error Connecting to the Server");
        return;
      }
      console.log(error);
      if (error.response.status === 404) {
        setError("email", { message: "User not found" });
      }
      if (error.response.data === "Incorrect Password") {
        setError("password", { message: "Incorrect Password" });
      }
      if (error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Something Went Wrong");
      }
      console.log("eror logging in: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessLogo = businessConfig?.logo || "";

  return (
    <div className="h-[100vh] w-full relative">
      <div className="login-overlay flex flex-col items-center justify-center">
        <div className="w-20 md:w-30 absolute top-6 left-10">
          {!loading && businessLogo ? (
            <img src={businessLogo} alt="Logo" className="mx-auto w-22 h-auto" />
          ) : (
            <img src={Logo} alt="Logo" className="mx-auto w-20 h-auto" />
          )}
        </div>
        <div className="hidden md:block absolute w-[400px] bottom-0 left-0">
          <img className="w-full" src={rb8171} alt="" />
        </div>
        <div className="hidden md:block absolute w-[600px] bottom-0 right-0">
          <img className="w-full" src={rb47921} alt="" />
        </div>
        <div className="border mt-4 rounded-xl w-full max-w-96 sm:max-w-fit sm:w-fit py-4 p-2 md:p-6 bg-white shadow-custom-lg">
          <h3 className="text-3xl mb-2 text-green font-bold text-center ">
            Welcome Back,
          </h3>
          <p className="text-lg text-center text-opacity-80">Login to Continue</p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-3 mt-4 w-full sm:w-96 mx-auto"
          >
            <div className="relative w-full mb-3">
              <label className=" text-sm  mt-2 mb-3">Email</label>
              <input
                {...register("email", {
                  required: "Email is Required",
                })}
                placeholder="email@example.com"
                className="p-3 text-sm w-full mt-1  ring-1 ring-[#000] ring-opacity-20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
                type="email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 mb-1">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>
            <div className="relative w-full mb-3">
              <label className=" text-sm  mt-2">Password</label>
              <input
                {...register("password", {
                  required: "Password is Required",
                  minLength: {
                    value: 8,
                    message: "Password must be minimum 8 characters",
                  },
                })}
                type="password"
                placeholder="xxxxxxxx"
                className="p-3 text-sm w-full mt-1  ring-1 ring-[#000] ring-opacity-20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1 ">
                  {errors.password.message?.toString()}
                </p>
              )}
            </div>
            <div className="flex justify-between mt-3">
              <div className="flex  gap-1 ">
                <input {...register("rememberMe")} type="checkbox" />
                <label className="text-sm ">Remember me</label>
              </div>
              <Link to="/reset-password" className="text-sm hover:underline ">
                Forgot Password ?
              </Link>
            </div>
            <button
              type="submit"
              className="mt-4 bg-indigo-500 hover:bg-secondary text-white py-3 rounded-lg disabled:opacity-80"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
