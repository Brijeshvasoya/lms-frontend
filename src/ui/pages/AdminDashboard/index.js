import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button, UncontrolledTooltip } from "reactstrap";
import { Edit, Trash, Heart, BookOpen } from "react-feather";
import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";
import { GET_BOOKS } from "./query";
import { toast } from "react-toastify";
import dummyBookCover from "../../../assets/avatar-blank.png";
import AddBook from "../AddBook";
import { DELETE_BOOK } from "./mutation";
import ConfirmationModal from "../../components/Alert";

const Index = () => {
  const { loading, error, data,refetch } = useQuery(GET_BOOKS);
  const [deleteBook, { loading: deleteBookLoading }] = useMutation(DELETE_BOOK,{
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });
  const [books, setBooks]= useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setBooks(data.books);
    }
  }, [data]);

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
    setIsEdit(true);
    setOnSuccess(false);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
    if (isEditModalOpen) {
      setSelectedBook(null);
      setIsEdit(false);
      setOnSuccess(false);
    }
  };

  const handleDelete = (book) => {
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
          "Book has been deleted.",
          "ok",
          false
        ).then(() => {
          deleteBook({
            variables: { id: book._id },
          })
          .then(() => {
            toast.success("Book deleted successfully", { autoClose: 1000 });
            refetch();
          })
          .catch((err) => {
            toast.error(err?.message || "Failed to delete book");
          });
        });
      }
    })
    console.log("Delete book:", book);
  };

  const handleWishlist = (book) => {
    console.log("Add to wishlist:", book);
    toast.success("Added to wishlist successfully", { autoClose: 1000 });
  };

  const handleIssue = (book) => {
    console.log("Issue book:", book);
    toast.success("Book issued successfully", { autoClose: 1000 });
  };

  if (error) {
    toast.error(error?.message, { autoClose: 2000 });
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner size={75} color="#ffffff" />
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

                      {/* Wishlist Button
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          id={`wishlist-${book._id}`}
                          onClick={() => handleWishlist(book)}
                          className="p-2 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 hover:shadow-xl"
                        >
                          <Heart
                            className="transform hover:scale-110 transition-transform"
                            size={16}
                          />
                        </Button>
                        <UncontrolledTooltip
                          target={`wishlist-${book._id}`}
                          placement="top"
                        >
                          <span className="text-white">Add to Wishlist</span>
                        </UncontrolledTooltip>

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
                      </div> */}
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
                      {new Date(
                        parseInt(book.publishDate)
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      onClick={() => handleEdit(book)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(book)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash size={16} />
                    </Button>
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
      <Modal
        isOpen={isEditModalOpen}
        toggle={toggleEditModal}
        modalOpen={isEditModalOpen}
        title={selectedBook ? "Edit Book" : "Add Book"}
      >
        <AddBook bookData={selectedBook} isEdit={isEdit} onSuccess={toggleEditModal} />
      </Modal>
    </div>
  );
};

export default Index;
