import React, { useState, useEffect } from "react";
import { Input } from "reactstrap";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";

import Table from "../../components/Table";
import { userTable } from "../../components/Constant";
import ConfirmationModal from "../../components/Alert";
import { GET_USER } from "./query";
import { DELETE_USER, VERIFY_USER, DEACTIVE_USER } from "./mutation";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const {
    data: userData,
    loading,
    refetch,
  } = useQuery(GET_USER, {
    fetchPolicy: "cache-and-network",
    variables: {
      searchTerm: searchTerm.trim() !== "" ? searchTerm : undefined,
    },
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const [verifyUser] = useMutation(VERIFY_USER, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const [deactiveUser] = useMutation(DEACTIVE_USER, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  useEffect(() => {
    if (!userData?.users) {
      setFilteredUsers([]);
      return;
    }
    const user = userData.users.map((user) => ({
      ...user,
      dob: user.dob ? moment(parseInt(user.dob)).format("DD MMM YYYY") : "N/A",
    }));
    setFilteredUsers(user);
  }, [userData,loading]);

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleViewUser = (row) => {
    console.log(row?._id);
    navigate(`/user-book/${row?._id}`);
  }

  const handleDeleteUser = (row) => {
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
          "User has been deleted.",
          "ok",
          false
        ).then(() => {
          deleteUser({
            variables: { deleteUserId: row._id },
          })
            .then(() => {
              toast.success("User deleted successfully");
              refetch();
            })
            .catch((err) => {
              toast.error(err?.message || "Failed to delete user");
            });
        });
      } else {
        toast.error("User not deleted");
      }
    });
  };

  const handleActiveUser = (row) => {
    const userId = row._id;
    const action = row?.isVerified ? deactiveUser : verifyUser;
    const actionText = row?.isVerified ? "Deactivate user" : "Activate user";
    const confirmationText = row?.isVerified ? "Deactivated!" : "Activated!";
    const successText = row?.isVerified
      ? "User is Deactivated"
      : "User is Verified";
    ConfirmationModal(
      "warning",
      "Are you sure?",
      actionText,
      `Yes, ${actionText}!`,
      true
    ).then((result) => {
      if (result.isConfirmed) {
        ConfirmationModal(
          "success",
          confirmationText,
          successText,
          "OK",
          false
        ).then(() => {
          action({
            variables: {
              [row?.isVerified ? "deactiveUserId" : "verifyUserId"]: userId,
            },
          })
            .then(() => {
              toast.success(`${successText} Successfully`);
              refetch();
            })
            .catch((err) => {
              toast.error(err?.message || `Failed to ${actionText}`);
            });
        });
      }
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
    <div>
      <div className="flex justify-between mt-4 space-x-4">
        <Input
          type="text"
          value={searchTerm}
          placeholder="Search User"
          onChange={handleChange}
          className="mt-2 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="my-5">
        <Table
          columns={userTable}
          data={filteredUsers}
          viewData={handleViewUser}
          deleteData={handleDeleteUser}
          loading={loading}
          handleActiveUser={handleActiveUser}
        />
      </div>
    </div>
  );
};

export default Index;
