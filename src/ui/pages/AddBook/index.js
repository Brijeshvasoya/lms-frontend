import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Label, Button, Input, FormText } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import DatePicker from "../../components/DatePicker";
import { Camera, Trash } from "react-feather";
import { toast } from "react-toastify";
import dummyBookCover from "../../../assets/avatar-blank.png";
import Spinner from "../../components/Spinner";
import { ADD_BOOK, UPDATE_BOOK } from "./mutation";
import { GET_BOOKS } from "../AdminDashboard/query";
import ConfirmationModal from "../../components/Alert";

const Index = ({ bookData, isEdit, onSuccess, model }) => {
  const navigate = useNavigate();
  const [base64Url, setBase64Url] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancel, setCancel] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { refetch } = useQuery(GET_BOOKS);

  const [addBook, { loading: addBookLoading }] = useMutation(ADD_BOOK, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const [updateBook, { loading: updateBookLoading }] = useMutation(
    UPDATE_BOOK,
    {
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    }
  );

  useEffect(() => {
    setLoading(addBookLoading || updateBookLoading);
  }, [addBookLoading, updateBookLoading]);

  useEffect(() => {
    if (isEdit && bookData) {
      setBase64Url(bookData.coverImage);
      reset({
        title: bookData.title,
        author: bookData.author,
        publisher: bookData.publisher,
        publishDate: moment(bookData.publishDate).format("DD-MM-YYYY"),
      });
    }
  }, [isEdit, bookData, reset]);

  const handleImageUpload = (event) => {
    const file = event?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBase64Url(reader?.result);
        setCancel(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
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
          "Your Book Cover is Removed",
          "ok",
          false
        ).then(() => {
          setBase64Url("");
          setCancel(false);
          const fileInput = document.getElementById("cover-image");
          if (fileInput) {
            fileInput.value = "";
          }
        }).catch((error) => {
          toast.error(error?.message, { autoClose: 2000 });
        });
      }
    });
  };

  const onSubmit = (data) => {
    if (!base64Url) {
      toast.error("Please upload a book cover", { autoClose: 2000 });
      return;
    }

    const bookInput = {
      ...data,
      coverImage: base64Url,
    };

    if (isEdit) {
      updateBook({
        variables: {
          id: bookData._id,
          input: bookInput,
        },
      })
        .then(() => {
          toast.success("Book updated successfully", { autoClose: 1000 });
          setLoading(false);
          onSuccess();
          refetch();
        })
        .catch((err) => {
          toast.error(err?.message, { autoClose: 2000 });
          setLoading(false);
        });
    } else {
      addBook({
        variables: {
          input: bookInput,
        },
      })
        .then(() => {
          toast.success("Book added successfully", { autoClose: 1000 });
          setLoading(false);
          setBase64Url("");
          refetch();
          onSuccess();
          navigate("/admin-dashboard");
          reset();
        })
        .catch((err) => {
          toast.error(err?.message, { autoClose: 2000 });
          setLoading(false);
        });
    }
  };

  const handleCancel = () => {
    if (model) {
      onSuccess();
    } else {
      navigate("/admin-dashboard");
    }
  };

  return (
    <div className={`${isEdit ? "w-full" : "container mx-auto px-4 py-8"}`}>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Spinner size={75} color="#4169E1" />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`bg-white ${
            !isEdit && "p-8 rounded-2xl shadow-xl border border-gray-100"
          }`}
        >
          {!isEdit && (
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add New Book
              </h3>
              <p className="text-gray-500 mt-2">
                Fill in the details to add a new book to the library
              </p>
            </div>
          )}

          <div
            className={`${
              isEdit ? "flex gap-8" : "flex flex-col md:flex-row gap-8"
            }`}
          >
            <div className={`${isEdit ? "w-1/3" : "w-full md:w-1/3"}`}>
              <div className="flex justify-center">
                <div className="relative group -top-4">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative">
                    <img
                      src={base64Url || dummyBookCover}
                      alt="Book Cover"
                      className="w-48 h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-image"
                    />
                    <Label
                      htmlFor="cover-image"
                      className="cursor-pointer absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
                    >
                      <Camera className="h-5 w-5 text-white transform transition-all duration-300 hover:scale-110" />
                    </Label>
                  </div>
                  {cancel && (
                    <Label
                      className="cursor-pointer absolute top-3 right-3 bg-gradient-to-r from-red-600 to-purple-600 rounded-full p-3 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
                      onClick={removeImage}
                    >
                      <Trash className="h-5 w-5 text-white transform transition-all duration-300 hover:scale-110" />
                    </Label>
                  )}
                </div>
              </div>
            </div>

            <div className={`${isEdit ? "w-2/3" : "w-full md:w-2/3"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label
                    htmlFor="title"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    Book Title<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Book title is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter book title"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    )}
                  />
                  {errors.title && (
                    <FormText className="text-red-500 text-xs">
                      {errors.title.message}
                    </FormText>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="author"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    Author<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Controller
                    name="author"
                    control={control}
                    rules={{ required: "Author name is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter author name"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    )}
                  />
                  {errors.author && (
                    <FormText className="text-red-500 text-xs">
                      {errors.author.message}
                    </FormText>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="publisher"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    Publisher<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Controller
                    name="publisher"
                    control={control}
                    rules={{ required: "Publisher name is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter publisher name"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    )}
                  />
                  {errors.publisher && (
                    <FormText className="text-red-500 text-xs">
                      {errors.publisher.message}
                    </FormText>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="publishDate"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    Publish Date<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Controller
                    name="publishDate"
                    control={control}
                    rules={{
                      required: "Publish date is required",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        max={moment()._d}
                        placeholder="Select publish date"
                        invalid={!!errors?.publishDate}
                        onChange={(e) => onChange(e[0])}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          errors?.publishDate
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        } transition-all duration-200`}
                        value={value}
                      />
                    )}
                  />
                  {errors.publishDate && (
                    <FormText className="text-red-500 text-xs">
                      {errors.publishDate.message}
                    </FormText>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <Button
                  type="button"
                  color="secondary"
                  onClick={handleCancel}
                  className="px-6 py-2.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="px-6 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                >
                  {isEdit ? "Update Book" : "Add Book"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Index;
