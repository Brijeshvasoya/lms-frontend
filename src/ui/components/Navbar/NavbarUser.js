import UserDropdown from "./UserDropdown";
import { NavItem, NavLink } from "reactstrap";
import { Heart } from "react-feather";
import { useNavigate } from "react-router-dom";

const NavbarUser = ({role}) => {
  const navigate = useNavigate();

  return (
    <ul className="flex justify-between items-center space-x-6">
      {role !== "admin" && (
        <div>
          <Heart className="w-6 h-6 cursor-pointer hover:text-red-600" onClick={() => navigate("/wishlist")} />
        </div>
      )}
      <NavItem>
        <NavLink className="text-white hover:text-gray-300">
          <UserDropdown role={role}/>
        </NavLink>
      </NavItem>  
    </ul>
  );
};

export default NavbarUser;
