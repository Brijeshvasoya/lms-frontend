import React, { Fragment} from "react";
import NavbarUser from "./NavbarUser";

const Index = (props) => {
  const activeUser = JSON.parse(localStorage.getItem("active_user"));    
  return (
    <Fragment>
      <div className="flex w-full justify-between items-center p-4 mx-5 my-5 bg-slate-800 text-white rounded-md shadow-lg">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome { activeUser && activeUser?.fname} {activeUser?.lname || ""}
          </h1>
        </div>
        <div>
          <NavbarUser />
        </div>
      </div>
    </Fragment>
  );
};  

export default Index;
