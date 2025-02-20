import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useMutation } from "@apollo/client";
import InputPasswordToggle from "../../components/input-password-toggle";
import Spinner from "../../components/Spinner";
import { SIGN_IN } from "./mutation.js";
import {
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  FormText,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";

import cover from "../../../../src/assets/images/pages/login-v2.avif";
import source from "../../../../src/assets/images/logo.png";

const Index = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const [rememberMe, setRememberMe] = useState(false);
  const [, setCookie] = useCookies(["Remember"]);
  const [signIn, { loading }] = useMutation(SIGN_IN);

  const onSubmit = (data, e) => {
    e.preventDefault();
    if (data?.email && data?.password) {
      signIn({
        variables: {
          userData: { email: data?.email.trim(), password: data?.password },
        },
      })
        .then(async ({ data }) => {
          if (rememberMe) {
            const userEmail = data?.signInUser?.user?.email;  
            setCookie("remember", JSON.stringify(userEmail));
          }
          if (data?.signInUser?.token) {
            localStorage.setItem("token", data?.signInUser?.token);
            localStorage.setItem(
              "active_user",
              JSON.stringify(data?.signInUser?.user)
            );
            toast.success("Login Successfully", { autoClose: 1000 });
            if (data?.signInUser?.user?.role === "admin") {
              navigate("/admin-dashboard");
            } else {
              navigate("/dashboard");
            }
          }
        })
        .catch((err) => {
          toast.error(err?.message, { autoClose: 2000 });
        });
    }
    reset();
  };

  return (
    <div className="flex h-screen container">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner size={75} color="#ffffff" />
        </div>
      )}
      <div className="w-1/2 flex flex-col justify-start items-start p-8">
        <img
          src={source}
          alt="logo img"
          className="w-32 cursor-pointer "
          onClick={() => navigate("/")}
        />
        <img src={cover} alt="cover img" className="w-full mt-4 h-4/5 mx-4" />
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <img
              src={source}
              alt="logo"
              className="mx-auto h-10 cursor-pointer"
            />
          </div>

          <CardTitle
            tag="h2"
            className="text-3xl font-semibold text-center text-gray-900 mb-2"
          >
            Welcome to EVS
          </CardTitle>
          <CardText className="text-center text-gray-600 mb-6">
            Please sign-in to your account and start the adventure
          </CardText>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1">
              <Label
                className="block text-sm font-medium text-gray-700"
                for="email"
              >
                Email<span className="text-red-500">&#42;</span>
              </Label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "Please enter a valid email",
                  },
                }}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      type="email"
                      id="email"
                      placeholder="Please Enter Email"
                      className="mt-2 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.email?.message && (
                      <FormText className="text-red-500">
                        {errors.email?.message}
                      </FormText>
                    )}
                  </>
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password is required",
                  pattern: {
                    value: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                    message: "Password must be between 6 and 16 characters",
                  },
                }}
                render={({ field }) => (
                  <>
                    <InputPasswordToggle
                      {...field}
                      label="Password"
                      htmlFor="Password"
                      visible={false}
                      iconSize={18}
                      placeholder="Enter Your Password"
                      inputClassName="mt-2 p-3 w-full rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.password?.message && (
                      <FormText className="text-red-500">
                        {errors.password?.message}
                      </FormText>
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Input
                  checked={rememberMe}
                  type="checkbox"
                  className="mr-2"
                  id="remember-me"
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <Label className="text-sm text-gray-600" htmlFor="remember-me">
                  Remember Me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              block
              className="w-full py-3 text-white font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign In
            </Button>
          </Form>

          <p className="text-center mt-4 text-sm text-gray-600">
            New on our platform?{" "}
            <Link
              to="/sign-up"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
