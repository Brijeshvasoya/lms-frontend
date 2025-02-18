import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User, Power } from "react-feather";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const UserDropdown = (props) => {
  const navigate = useNavigate();
  const [, removeCookie] = useCookies();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let user = JSON.parse(localStorage.getItem("active_user"));
  
  const activeUser = JSON.parse(localStorage.getItem("active_user"));
  const role=activeUser?.role;
    
  const signOut = () => {
    navigate("/");
    const newUser = { ...activeUser, isVerified: false };
    localStorage.removeItem("active_user");
    localStorage.clear();
    removeCookie("remember");
    user=null
    toast.success("Logout Successfully", { autoClose: 1000 });
  };

  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <div>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          className="flex items-center space-x-2 px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
          caret
        >
          <span>{user?.role}</span>
          <Menu />
        </DropdownToggle>
        {dropdownOpen && (
          <DropdownMenu className=" w-28 text-black text-center bg-[#f3f2f0] rounded-lg shadow-lg mt-2 ">
            <DropdownItem divider  />
            <DropdownItem
              onClick={() =>(role!=="admin")? navigate("/profile"):navigate("/admin-profile")}
              className="text-center my-2"
            >
              <span className="flex items-center">
                <User size={14} className="mr-2" />
                Profile
              </span>
            </DropdownItem>
            <DropdownItem divider className="border-t border-gray-300"/>
            <DropdownItem onClick={signOut} className="text-center my-2">
              <span className="flex items-center">
                <Power size={14} className="mr-2" />
                Logout
              </span>
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
    </div>
  );
};

export default UserDropdown;
