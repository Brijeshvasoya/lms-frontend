import React, { Fragment } from "react";
import NavbarUser from "./NavbarUser";

const Index = () => {
  const activeUser = JSON.parse(localStorage.getItem("active_user"));
  const role = activeUser?.role;

  return (
    <Fragment>
      <div className="flex justify-between items-center p-4 mx-5 my-5 bg-gradient-to-t from-blue-500 to-purple-500 text-white rounded-md shadow-lg">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome {activeUser && activeUser?.fname} {activeUser?.lname || ""}
          </h1>
        </div>
        <div>
          <NavbarUser role={role}/>
        </div>
      </div>
    </Fragment>
  );
};

export default Index;
