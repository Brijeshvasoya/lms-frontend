import React from "react";
import { Home, Users, Book, Clock } from "react-feather";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

const Index = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  const role = user?.role;
  const location = useLocation();

  const AdminsidebarItems = [
    {
      icon: <Home className="w-6 h-6" />,
      label: "Dashboard",
      path: "/admin-dashboard",
    },
    { icon: <Users className="w-6 h-6" />, label: "Users", path: "/users" },
  ];

  const UsersidebarItems = [
    {
      icon: <Home className="w-6 h-6" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <Book className="w-6 h-6" />,
      label: "Return Books",
      path: "/return-book",
    },
    { icon: <Clock className="w-6 h-6" />, label: "History", path: "/history" },
  ];

  const renderSidebarItems = (items) => (
    <ul className="w-full space-y-2">
      {items.map((item, index) => (
        <li key={index} className="w-full group">
          <Link
            to={item.path}
            className={`
              flex items-center w-full p-3 rounded-lg transition-all duration-300 ease-in-out
              ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }
              transform hover:scale-105 hover:pl-4
            `}
          >
            <span className="mr-4 opacity-75 group-hover:opacity-100 transition-opacity">
              {item.icon}
            </span>
            <span className="text-sm font-medium tracking-wide">
              {item.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex">
      <div className="w-64 bg-gradient-to-b from-blue-500 to-purple-500 text-white h-full min-h-screen shadow-2xl">
        <div
          className="flex pt-8 transform transition-transform duration-300 cursor-pointer hover:scale-110"
          onClick={() =>
            navigate(`${role === "admin" ? "/admin-dashboard" : "/dashboard"}`)
          }
        >
          <img src={logo} alt="Logo" className="h-16 w-auto " />
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600 -ml-4">
            LIBRIFY
          </span>
        </div>

        <div className="px-4 py-6">
          {role === "admin" && renderSidebarItems(AdminsidebarItems)}
          {role === "user" && renderSidebarItems(UsersidebarItems)}
        </div>
      </div>
    </div>
  );
};

export default Index;
