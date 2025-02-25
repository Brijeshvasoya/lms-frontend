import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Label, Button, Input, FormText, Modal, ModalBody } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { Camera, XCircle, X } from "react-feather";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useMutation } from "@apollo/client";
import ConfirmationModal from "../../components/Alert";
import Spinner from "../../components/Spinner";
import DatePicker from "../../components/DatePicker";
import dummyImg from "../../../assets/avatar-blank (2).png";
import { UPDATE_PROFILE } from "./mutation";
import { DELETE_USER } from "../User/mutation";

const Index = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  const [base64Url, setBase64Url] = useState("");
  const [cancel, setCancel] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [, removeCookie] = useCookies();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [UpdateUser, { loading: updateLoading }] = useMutation(UPDATE_PROFILE, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });
  const [deleteUser, { loading: deleteLoading }] = useMutation(DELETE_USER, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  useEffect(() => {
    const localProfilePicture = user?.profilePicture
      ? user?.profilePicture
      : null;
    if (localProfilePicture) {
      setProfilePicture(localProfilePicture);
      setCancel(true);
    }
    if (user) {
      const parsedDob = user?.dob ? new Date(parseInt(user?.dob)) : null;
      setValue("fname", user?.fname);
      setValue("lname", user?.lname);
      setValue("email", user?.email);
      setValue("dob", parsedDob);
      setValue("age", user?.age);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (base64Url) {
      toast.success("Your Profile Photo add successfully", { autoClose: 1000 });
      setCancel(true);
    }
  }, [base64Url]);

  if (deleteLoading || updateLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Spinner size={75} color="#4169E1" />
      </div>
    );
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBase64Url(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    data.dob = new Date(data.dob).toISOString();
    let newDetail;
    if (base64Url) {
      newDetail = {
        ...data,
        _id: user?._id,
        profilePicture: base64Url,
      };
    } else {
      newDetail = {
        ...data,
        _id: user?._id,
        profilePicture: "",
      };
    }
    UpdateUser({
      variables: {
        userData: newDetail,
      },
    })
      .then(() => {
        setProfilePicture(base64Url);
        toast.success("Your Profile Updated Successfully", { autoClose: 1000 });
      })
      .catch((error) => {
        toast.error(error?.message, { autoClose: 2000 });
      });
  };

  const removeImg = () => {
    ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!",
      true
    )
      .then((result) => {
        if (result.isConfirmed) {
          ConfirmationModal(
            "success",
            "Deleted!",
            "Your Profile Photo is Removed",
            "ok",
            false
          ).then(() => {
            setBase64Url(null);
            setProfilePicture(null);
            setCancel(false);
            const fileInput = document.getElementById("upload-image");
            if (fileInput) {
              fileInput.value = "";
            }
            toast.success("Your Profile Photo is Removed", { autoClose: 1000 });
          });
        }
      })
      .catch((error) => {
        toast.error(error?.message, { autoClose: 2000 });
      });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const showImage = () => {
    if (base64Url || profilePicture) {
      setShowImageModal(true);
    }
  };

  const handleDeleteAccount = () => {
    ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!",
      true
    ).then((result) => {
      if (result.isConfirmed) {
        ConfirmationModal(
          "success",
          "Deleted!",
          "Your Profile is Deleted.",
          "ok",
          false
        ).then(() => {
          deleteUser({
            variables: { deleteUserId: user?._id },
          })
            .then(() => {
              toast.success("Your Profile is Deleted", { autoClose: 1000 });
              localStorage.clear();
              removeCookie("remember");
              navigate("/");
            })
            .catch((err) => {
              toast.error(err?.message || "Failed to delete user");
            });
        });
      } else {
        toast.error("Your Profile is not deleted");
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Modal
        isOpen={showImageModal}
        toggle={() => setShowImageModal(!showImageModal)}
        className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
      >
        <ModalBody className="p-4 bg-white rounded-lg">
          <div className="relative">
            <div className="w-64 h-96">
              <img
                src={base64Url || profilePicture || dummyImg}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <button
              className="absolute -top-6 -right-6 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg text-xl font-bold"
              onClick={() => setShowImageModal(false)}
            >
              <X />
            </button>
          </div>
        </ModalBody>
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-10">
          <div className="relative">
            {cancel && (
              <Label
                htmlFor="remove-image"
                className="cursor-pointer absolute -right-2 -top-2 z-10"
                onClick={removeImg}
              >
                <XCircle className="text-red-500 hover:text-red-600 transition-colors" />
              </Label>
            )}
            <div className="relative group">
              <img
                src={base64Url || profilePicture || dummyImg}
                alt="Profile"
                className="rounded-full h-24 w-24 object-cover border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={showImage}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="upload-image"
              />
              <Label
                htmlFor="upload-image"
                className="cursor-pointer absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 rounded-full p-2 transition-colors"
              >
                <Camera className="h-4 w-4 text-white" />
              </Label>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.fname} {user?.lname}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-section bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="fname"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                First Name
              </Label>
              <Controller
                name="fname"
                control={control}
                defaultValue=""
                rules={{ required: "First Name is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter First Name"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              />
              {errors.fname && (
                <FormText className="text-red-500 text-sm mt-1">
                  {errors.fname.message}
                </FormText>
              )}
            </div>
            <div>
              <Label
                htmlFor="lname"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Last Name
              </Label>
              <Controller
                name="lname"
                control={control}
                defaultValue=""
                rules={{ required: "Last Name is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Last Name"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              />
              {errors.lname && (
                <FormText className="text-red-500 text-sm mt-1">
                  {errors.lname.message}
                </FormText>
              )}
            </div>
            <div>
              <Label
                htmlFor="dob"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Date of Birth
              </Label>
              <Controller
                name="dob"
                control={control}
                defaultValue=""
                rules={{ required: "Date of Birth is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    placeholderText="Enter Date of Birth"
                    selected={field.value}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              />
              {errors.dob && (
                <FormText className="text-red-500 text-sm mt-1">
                  {errors.dob.message}
                </FormText>
              )}
            </div>
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </Label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter Email"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              />
              {errors.email && (
                <FormText className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </FormText>
              )}
            </div>
            <div>
              <Label
                className="block text-sm font-semibold text-gray-700 mb-2"
                for="age"
              >
                Age<span className="text-red-500 ml-1">&#42;</span>
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
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.age?.message && (
                      <FormText className="text-red-500 text-sm mt-1">
                        {errors.age?.message}
                      </FormText>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="flex mt-8 justify-end space-x-4">
            {user?.role !== "admin" && (
              <Button
                type="button"
                color="secondary"
                onClick={handleDeleteAccount}
                className="px-6 py-2.5 text-white font-medium rounded-lg bg-red-500 hover:bg-red-600 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Account
              </Button>
            )}
            <Button
              type="button"
              color="secondary"
              onClick={handleCancel}
              className="px-6 py-2.5 text-white font-medium rounded-lg bg-gray-500 hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              className="px-6 py-2.5 text-white font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Update Profile
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Index;
