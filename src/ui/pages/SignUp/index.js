import React from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import InputPasswordToggle from "../../components/input-password-toggle";
import DatePicker from "../../components/DatePicker";
import Spinner from "../../components/Spinner";
import { SIGN_UP } from "./mutation.js";
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

const Index = () => {
  const navigate = useNavigate();
  const [signUp, { loading }] = useMutation(SIGN_UP);

  const source = require(`../../../../src/assets/images/logo.png`);
  const cover = require(`../../../../src/assets/images/pages/sign-up.avif`);

  const {
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = (data, e) => {
    e.preventDefault();
    if (data) {
      delete data.cpassword;
      data.email = data.email.toLowerCase().trim();
      data.password = data.password.trim();
      data.age = Number(data.age);
      signUp({
        variables: {
          input: data,
        },
      })
        .then(() => {
          toast.success("Signed up successfully");
          navigate("/");
        })
        .catch((err) => {
          toast.error(err?.message);
        });
    }
    reset();
  };

  return (
    <div className="flex container">
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

      <div className="w-1/2 pt-10 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <CardTitle className="text-3xl font-semibold text-center text-gray-900 mb-2">
            Welcome to EVS
          </CardTitle>
          <CardText className="text-center text-gray-600 mb-6">
            Please sign-in to your account and start the adventure
          </CardText>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1">
              <Label
                className="block text-sm font-medium text-gray-700"
                for="fname"
              >
                First Name<span className="text-red-500">&#42;</span>
              </Label>
              <Controller
                name="fname"
                control={control}
                defaultValue=""
                rules={{
                  required: "First Name is required",
                }}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      type="text"
                      id="fname"
                      placeholder="Please Enter Firstname"
                      className="mt-2 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.fname?.message && (
                      <FormText className="text-red-500">
                        {errors.fname?.message}
                      </FormText>
                    )}
                  </>
                )}
              />
            </div>

            <div className="mb-1">
              <Label
                className="block text-sm font-medium text-gray-700"
                for="lname"
              >
                Last Name<span className="text-red-500">&#42;</span>
              </Label>
              <Controller
                name="lname"
                control={control}
                defaultValue=""
                rules={{
                  required: "Last Name is required",
                }}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      type="text"
                      id="lname"
                      placeholder="Please Enter Lastname"
                      className="mt-2 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.lname?.message && (
                      <FormText className="text-red-500">
                        {errors.lname?.message}
                      </FormText>
                    )}
                  </>
                )}
              />
            </div>

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

            <div className="mb-1">
              <Label
                className="block text-sm font-medium text-gray-700"
                for="age"
              >
                Age<span className="text-red-500">&#42;</span>
              </Label>
              <Controller
                name="age"
                control={control}
                defaultValue=""
                rules={{
                  required: "Age is required",
                }}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter Your Age"
                      className="mt-2 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.age?.message && (
                      <FormText className="text-red-500">
                        {errors.age?.message}
                      </FormText>
                    )}
                  </>
                )}
              />
            </div>

            <div className="mb-1">
              <Label
                className="block text-sm font-medium mb-2 text-gray-700"
                for="dob"
              >
                DOB<span className="text-red-500">&#42;</span>
              </Label>
              <Controller
                name="dob"
                control={control}
                rules={{
                  required: "Date of Birth is required",
                }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <DatePicker
                      max={moment()._d}
                      placeholder="Enter Date of Birth"
                      invalid={!!errors?.dob}
                      onChange={(e) => onChange(e[0])}
                      className={`mt-2 p-3 w-full rounded-lg border ${
                        errors?.dob
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-indigo-500"
                      } focus:outline-none focus:ring-2`}
                      value={value}
                    />
                  );
                }}
              />
              {errors?.dob && (
                <FormText className="text-red-500">
                  {errors.dob?.message}
                </FormText>
              )}
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

            <div className="mb-4">
              <Controller
                name="cpassword"
                control={control}
                defaultValue=""
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                  pattern: {
                    value: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                    message: "Password must be between 6 and 16 characters",
                  },
                }}
                render={({ field }) => (
                  <>
                    <InputPasswordToggle
                      {...field}
                      label="Confirm Password"
                      htmlFor="cpassword"
                      visible={false}
                      iconSize={18}
                      placeholder="Enter Confirm Password"
                      inputClassName="mt-2 p-3 w-full rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.cpassword?.message && (
                      <FormText className="text-red-500">
                        {errors.cpassword?.message}
                      </FormText>
                    )}
                  </>
                )}
              />
            </div>

            <Button
              type="submit"
              color="primary"
              block
              className="w-full py-3 text-white font-medium rounded-lg bg-blue-500  hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Register
            </Button>
          </Form>

          <p className="text-center mt-4 text-sm text-gray-600">
            <span className="mr-25">Already have an account? </span>
            <Link to="/" className="text-indigo-600 hover:text-indigo-800">
              <span>Sign in instead</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
