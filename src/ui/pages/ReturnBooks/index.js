import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Book, Calendar, Clock, XCircle,Clipboard } from "react-feather";
import { toast } from "react-toastify";
import moment from "moment";
import { GET_ISSUED_BOOKS } from "./query";
import { RETURN_BOOK } from "./mutation";
import Spinner from "../../components/Spinner";
import ConfirmationModal from "../../components/Alert";

const calculateDaysAndPenalty = (bookToBeReturned) => {
  const returnDate = moment(parseInt(bookToBeReturned)).startOf("day");
  const today = moment().startOf("day");
  const daysLeft = returnDate.diff(today, "days");
  const penalty = daysLeft < 0 ? Math.abs(daysLeft) * 10 : 0;
  return { daysLeft, penalty };
};

const Index = () => {
  const { loading, data, refetch } = useQuery(GET_ISSUED_BOOKS, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
    fetchPolicy: "no-cache",
  });

  const [returnBook] = useMutation(RETURN_BOOK,{
    context:{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }
  });

  const handleReturnBook = async (id) => {
    const returnDate = moment();
    const issue = data.BookIssuer.find(issue => issue._id === id);
    const dueDate = moment(parseInt(issue?.bookToBeReturned)).startOf("day");
    const daysLeft = dueDate.diff(returnDate, "days");
    const penalty = daysLeft < 0 ? Math.abs(daysLeft) * 10 : 0;
    ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, return it!",
      true
    ).then((result) => {
      if (result.isConfirmed) {
        ConfirmationModal(
          "success",
          "Returned!",
          "Book has been returned.",
          "ok",
          false
        ).then(() => {
          returnBook({
            variables: {
              input: {
                _id: id,
                returnDate: returnDate.format("YYYY-MM-DD"),
                penalty: parseInt(penalty),
              },
            },
          })
            .then(() => {
              toast.success("Book returned successfully!",{autoClose: 1000});
              refetch();
            })
            .catch((err) => {
              toast.error(err?.message,{autoClose: 2000});
            });
        })
      }
    })
  };

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Spinner size={75} color="#4169E1" />
      </div>
    );
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Issued Books</h1>
          <p className="mt-1 text-sm text-gray-600">
            View all your currently issued books and their return dates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.BookIssuer?.map((issue) => {
            const { daysLeft, penalty } = calculateDaysAndPenalty(issue?.bookToBeReturned);
            return (
              <div
                key={issue?._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {issue?.bookid?.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        by {issue?.bookid?.author}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Book className="text-blue-600" size={24} />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                      <Clipboard size={16} className="mr-2 text-gray-400" />
                      <span>Issued Date: </span>
                      <span className="ml-1 font-medium">
                        {moment(parseInt(issue?.issuedDate)).format(
                          "DD MMMM YYYY"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      <span>Return Date: </span>
                      <span className="ml-1 font-medium">
                        {moment(parseInt(issue?.bookToBeReturned)).format(
                          "DD MMMM YYYY"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2 text-gray-400" />
                      <span>Days Remaining: </span>
                      <span
                        className={`ml-1 font-medium ${
                          daysLeft < 0
                            ? "text-red-600"
                            : daysLeft === 0
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {daysLeft < 0
                          ? `${Math.abs(daysLeft)} days overdue`
                          : daysLeft === 0
                          ? "Due today"
                          : `${daysLeft} days left`}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <XCircle size={16} className="mr-2 text-gray-400" />
                      <span>Penalty: </span>
                      <span
                        className={`ml-1 font-medium ${
                          daysLeft < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {daysLeft < 0 ? `${penalty} Rs Penalty` : 0}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <Book size={16} className="mr-2 text-gray-400" />
                      <span>Publisher: </span>
                      <span className="ml-1">{issue?.bookid?.publisher}</span>
                    </div>
                  </div>
                  <div className="flex justify-end text-sm text-gray-600">
                    <button
                      className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded"
                      onClick={() => handleReturnBook(issue?._id)}
                    >
                      Return Book
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {data?.issuedBooks?.length === 0 && (
          <div className="text-center py-12">
            <Book size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No Books Issued
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't issued any books yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
