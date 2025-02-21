import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button, UncontrolledTooltip } from "reactstrap";
import { Heart, BookOpen } from "react-feather";
import Spinner from "../../components/Spinner";
import { GET_BOOKS } from "../AdminDashboard/query";
import { GET_WISHLIST } from "./query";
import { ADD_WISH_LIST } from "./mutation";
import { toast } from "react-toastify";
import dummyBookCover from "../../../assets/avatar-blank.png";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate=useNavigate()
  const { loading, error, data } = useQuery(GET_BOOKS);
  const [addWishList] = useMutation(ADD_WISH_LIST, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const { loading: wishListLoading, error: wishListError, data: wishListData,refetch } = useQuery(GET_WISHLIST, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const [books, setBooks] = useState([]);
  const [wishListBooks, setWishListBooks] = useState([]);

  useEffect(() => {
    if (data) {
      setBooks(data.books);
    }
    if (wishListData) {
      setWishListBooks(wishListData.wishlists);
    }
  }, [data, wishListData]);

  const isBookInWishlist = (bookId) => {
    return wishListBooks.some((wishlist) => wishlist.book._id === bookId);
  };

  const handleWishlist = (book) => {
    if (!book) {
      toast.error("Book not found", { autoClose: 2000 });
      return;
    }
    addWishList({
      variables: {
        input: {
          bookId: book._id,
        },
      },
    })
      .then(() => {
        toast.success("Book added to wishlist", { autoClose: 1000 });
        refetch();
      })
      .catch((err) => {
        toast.error(err?.message, { autoClose: 2000 });
      });
  };

  const handleIssue = (book) => {
    navigate(`/issue-book/${book._id}`);
  };

  if (error || wishListError) {
    toast.error(error?.message, { autoClose: 2000 });
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {loading || wishListLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Spinner size={75} color="#4169E1" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Library Books</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform hover:scale-105"
              >
                <div className="relative h-64 group">
                  <img
                    src={book.coverImage || dummyBookCover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-all duration-300"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-lg truncate flex-1 mr-2">
                        {book.title}
                      </h3>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          id={`issue-${book._id}`}
                          onClick={() => handleIssue(book)}
                          className="p-2 bg-white/90 hover:bg-white text-blue-500 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 hover:shadow-xl"
                        >
                          <BookOpen
                            className="transform hover:scale-110 transition-transform"
                            size={16}
                          />
                        </Button>
                        <UncontrolledTooltip
                          target={`issue-${book._id}`}
                          placement="top"
                        >
                          <span className="text-white">Issue Book</span>
                        </UncontrolledTooltip>

                        <Button
                          id={`wishlist-${book._id}`}
                          onClick={() => handleWishlist(book)}
                          disabled={isBookInWishlist(book._id)}
                          className={`p-2 bg-white/90 hover:bg-white ${
                            isBookInWishlist(book._id)
                              ? "text-red-600 opacity-50"
                              : "text-gray-400"
                          } rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 hover:shadow-xl`}
                        >
                          <Heart
                            className={`transform hover:scale-110 transition-transform ${
                              isBookInWishlist(book._id) ? "fill-current" : ""
                            }`}
                            size={16}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Author:</span>{" "}
                      {book.author}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Publisher:</span>{" "}
                      {book.publisher}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Published:</span>{" "}
                      {moment(book.publishDate).format("DD MMM YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {books.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No books found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Index;
