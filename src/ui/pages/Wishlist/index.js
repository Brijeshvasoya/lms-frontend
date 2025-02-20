import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { GET_WISHLIST } from "./query";
import { REMOVE_FROM_WISHLIST } from "./mutation";
import Spinner from "../../components/Spinner";
import { Button } from "reactstrap";
import { Trash2 } from "react-feather";
import { toast } from "react-toastify";
import moment from "moment";
import dummyBookCover from "../../../assets/avatar-blank.png";

const Index = () => {
  const { data, loading, error, refetch } = useQuery(GET_WISHLIST, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const [wishlistBooks, setWishlistBooks] = useState([]);

  useEffect(() => {
    if (data) {
      setWishlistBooks(data.wishlists);
    }
  }, [data]);

  const handleRemoveFromWishlist = (id) => {
    removeFromWishlist({
      variables: {
        id: id,
      },
    })
      .then(() => {
        toast.success("Removed from wishlist", { autoClose: 1000 });
        refetch();
      })
      .catch((err) => {
        toast.error(err?.message, { autoClose: 2000 });
      });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Spinner size={75} color="#4169E1" />
      </div>
    );
  }
  
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
      </div>

      {wishlistBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistBooks.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform hover:scale-105"
            >
              <div className="relative h-64 group">
                <img
                  src={item.book.coverImage || dummyBookCover}
                  alt={item.book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-all duration-300"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg truncate flex-1 mr-2">
                      {item.book.title}
                    </h3>

                    <Button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="p-2 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 hover:shadow-xl"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">Author:</span>{" "}
                    {item.book.author}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Publisher:</span>{" "}
                    {item.book.publisher}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Published:</span>{" "}
                    {moment(item.book.publishDate).format("DD MMM YYYY")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
