import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_HISTORY } from "./query";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";

const Index = () => {
  const { data, loading, error } = useQuery(GET_HISTORY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  useEffect(() => {
    if (!data) return;
    if (error) return toast.error(error?.message, { autoClose: 2000 });
  }, [error, data]);
  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white px-6 rounded-lg shadow-xl flex items-center transition-transform transform hover:scale-95 hover:shadow-2xl">
          <div className="font-semibold h-16 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-lg">
            Total Issued Books : {data?.userHistory[0]?.totalIssuedBooks}
          </div>
        </div>
        <div className="bg-white px-6 rounded-lg shadow-xl flex items-center transition-transform transform hover:scale-95 hover:shadow-2xl">
          <div className="font-semibold h-16 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-lg">
            Total Late Returned Books :{" "}
            {data?.userHistory[0]?.totalLateReturnedBooks}
          </div>
        </div>
        <div className="bg-white px-6 rounded-lg shadow-xl flex items-center transition-transform transform hover:scale-95 hover:shadow-2xl">
          <div className="font-semibold h-16 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-lg">
            Total Penalty : {data?.userHistory[0]?.totalPenalty}
          </div>
        </div>
        <div className="bg-white px-6 rounded-lg shadow-xl flex items-center transition-transform transform hover:scale-95 hover:shadow-2xl">
          <div className="font-semibold h-16 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-lg">
            Total Pending Books : {data?.userHistory[0]?.totalPendingBooks}
          </div>
        </div>
        <div className="bg-white px-6 rounded-lg shadow-xl flex items-center transition-transform transform hover:scale-95 hover:shadow-2xl">
          <div className="font-semibold h-16 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-lg">
            Total Returned Books : {data?.userHistory[0]?.totalReturnedBooks}
          </div>
        </div>
        <div className="bg-white px-6 rounded-lg shadow-xl flex items-center transition-transform transform hover:scale-95 hover:shadow-2xl">
          <div className="font-semibold h-16 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-lg">
            Total Returned Books : {data?.userHistory[0]?.totalReturnedBooks}
          </div>
        </div>
      </div>
      <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-semibold mb-4">
        Issued Books:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.userHistory[0]?.issuedBooksDetails?.map((book) => (
          <div
            key={book?.bookid}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="flex flex-col space-y-4">
              <h5 className="font-semibold text-lg text-gray-800">
                {book?.title}
              </h5>
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong className="text-gray-700">Issued Date:</strong>{" "}
                  {new Date(parseInt(book?.issuedDate)).toLocaleDateString()}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">
                    Book To Be Return Days:
                  </strong>{" "}
                  {new Date(
                    parseInt(book?.bookToBeReturned)
                  ).toLocaleDateString()}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Return Days:</strong>{" "}
                  {book?.returnDays}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Penalty:</strong>{" "}
                  {book?.penalty}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Return Date:</strong>{" "}
                  {book?.returnDate
                    ? new Date(parseInt(book?.returnDate)).toLocaleDateString()
                    : ""}
                </p>
                <p>
                  <strong className="text-gray-700">Status:</strong>{" "}
                  {book?.isReturned ? "Returned" : "Not Returned"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
