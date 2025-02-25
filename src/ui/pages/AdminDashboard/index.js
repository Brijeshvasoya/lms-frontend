import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "reactstrap";
import { Edit, Trash } from "react-feather";
import moment from "moment";
import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";
import { GET_BOOKS } from "./query";
import { toast } from "react-toastify";
import dummyBookCover from "../../../assets/avatar-blank.png";
import AddBook from "../AddBook";
import { DELETE_BOOK } from "./mutation";
import ConfirmationModal from "../../components/Alert";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { loading: dataLoading, error, data, refetch } = useQuery(GET_BOOKS, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });
  const [deleteBook, { loading: deleteBookLoading }] = useMutation(
    DELETE_BOOK,
    {
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    }
  );
  const [books, setBooks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setBooks(data.books);
    }
    if (dataLoading || deleteBookLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if (error) {
      toast.error(error?.message, { autoClose: 2000 });
    }
  }, [data, dataLoading, deleteBookLoading, error]);

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
    setIsEdit(true);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBook(null);
    setIsEdit(false);
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
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Spinner size={75} color="#4169E1" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Library Books</h1>
            <Button
              onClick={()=>navigate("/add-book")}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 z-0"
            >
              <span className="text-lg font-medium">Add New Book</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </Button>
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
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Author:</span>
                      {book.author}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Publisher:</span>
                      {book.publisher}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Published:</span>
                      {moment(book.publishDate).format("DD MMM YYYY")}
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
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          toggle={toggleEditModal}
          modalOpen={isEditModalOpen}
          title={selectedBook ? "Edit Book" : "Add Book"}
        >
          <AddBook
            bookData={selectedBook}
            isEdit={isEdit}
            model={true}
            onSuccess={toggleEditModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default Index;
