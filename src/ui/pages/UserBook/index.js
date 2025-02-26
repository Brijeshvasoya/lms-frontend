import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { DollarSign } from "react-feather";
import { Badge } from "reactstrap";
import { GET_USER_BOOKS } from "./mutation";
import Spinner from "../../components/Spinner";
import Table from "../../components/Table";
import { userBookTable } from "../../components/Constant";
import { toast } from "react-toastify";

const Index = () => {
  const { id, amount } = useParams();
  const { loading, error, data } = useQuery(GET_USER_BOOKS, {
    variables: { studentid: id },
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const [bookData, setBookData] = useState([]);

  useEffect(() => {
    if (data) {
      const newData = data?.studentBookIssuers.map((book) => ({
        ...book,
        bookToBeReturned: moment(parseInt(book?.bookToBeReturned)).format(
          "DD MMM YYYY"
        ),
        returnDate: book?.returnDate
          ? moment(parseInt(book?.returnDate)).format("DD-MM-YYYY")
          : null,
        issuedDate: moment(parseInt(book?.issuedDate)).format("DD-MM-YYYY"),
      }));
      setBookData(newData);
    }
    if (error) return toast.error(error?.message, { autoClose: 2000 });
  }, [data, error]);

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Spinner size={75} color="#4169E1" />
      </div>
    );

  const userName =
    data?.studentBookIssuers[0]?.studentid?.fname +
      " " +
      data?.studentBookIssuers[0]?.studentid?.lname || "User";

  return (
    <div className="container rounded-lg shadow-xl max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-extrabold text-3xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text tracking-tight text-center">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
            Student Name:{" "}
          </span>{" "}
          {userName}
        </h1>
        <Badge
          color="danger"
          className="flex items-center text-xl py-2 px-4 rounded-lg bg-red-600 text-white shadow-md"
        >
          <DollarSign className="mr-2" />
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
            Total Penalty : {amount}
          </span>
        </Badge>
      </div>
      <div className="my-5">
        <Table columns={userBookTable} data={bookData}/>
      </div>
    </div>
  );
};

export default Index;
