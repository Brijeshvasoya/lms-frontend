import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Label, Button } from "reactstrap";
import { Book, Calendar, ArrowLeft } from "react-feather";
import moment from "moment";
import { ISSUE_BOOK } from "./mutation";
import { GET_BOOK } from "./query";
import { GET_BOOKS } from "../AdminDashboard/query";
import { GET_ISSUED_BOOKS } from "../ReturnBooks/query";
import Spinner from "../../components/Spinner";
import DatePicker from "../../components/DatePicker";
import { toast } from "react-toastify";

const Index = () => {
  const navigate = useNavigate();
  const active_user = JSON.parse(localStorage.getItem("active_user"));
  const { id } = useParams();
  const { data, loading } = useQuery(GET_BOOK, { variables: { id } });
  const { refetch } = useQuery(GET_ISSUED_BOOKS, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });
  const { refetch: refetchBooks } = useQuery(GET_BOOKS);
  const [issueBook, { loading: issuingBook }] = useMutation(ISSUE_BOOK);
  const [returnDate, setReturnDate] = useState(null);
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (data) {
      setBook(data.book);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!returnDate) {
      toast.error("Please select a return date");
      return;
    }
    issueBook({
      variables: {
        input: {
          bookid: id,
          studentid: active_user._id,
          bookToBeReturned: moment(returnDate).format("YYYY-MM-DD"),
          returnDays: returnDate
            ? moment(returnDate)
                .startOf("day")
                .diff(moment().startOf("day"), "days")
            : 0,
        },
      },
    })
      .then(() => {
        toast.success("Book issued successfully!");
        refetch();
        refetchBooks();
        navigate(-1);
      })
      .catch((err) => {
        toast.error(err?.message);
      });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Spinner size={75} color="#4169E1" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span className="text-sm font-medium">Back to Books</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center">
              <Book className="text-white/90 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-white">Issue Book</h2>
            </div>
          </div>

          <Form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <Label className="text-gray-600 text-sm font-medium mb-1.5 block">
                    Title
                  </Label>
                  <div className="text-sm bg-gray-50 px-4 py-3 rounded-lg border border-gray-200/80">
                    {book?.title}
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Label className="text-gray-600 text-sm font-medium mb-1.5 block">
                    Author
                  </Label>
                  <div className="text-sm bg-gray-50 px-4 py-3 rounded-lg border border-gray-200/80">
                    {book?.author}
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Label className="text-gray-600 text-sm font-medium mb-1.5 block">
                    Publisher
                  </Label>
                  <div className="text-sm bg-gray-50 px-4 py-3 rounded-lg border border-gray-200/80">
                    {book?.publisher}
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Label className="text-gray-600 text-sm font-medium mb-1.5 block">
                    Publish Date
                  </Label>
                  <div className="text-sm bg-gray-50 px-4 py-3 rounded-lg border border-gray-200/80">
                    {moment(book?.publishDate).format("DD MMM YYYY")}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center mb-1.5">
                  <Calendar size={16} className="text-gray-500 mr-1.5" />
                  <Label className="text-gray-600 text-sm font-medium">
                    Return Date <span className="text-red-500">*</span>
                  </Label>
                </div>
                <DatePicker
                  min={moment()._d}
                  onChange={(date) => setReturnDate(date[0])}
                  placeholder="Select return date"
                  className="mt-2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  value={returnDate}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={issuingBook}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  disabled={issuingBook}
                >
                  {issuingBook ? (
                    <span className="flex items-center justify-center">
                      <Spinner size={16} color="#ffffff" className="mr-2" />
                      Issuing...
                    </span>
                  ) : (
                    "Issue Book"
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Index;
