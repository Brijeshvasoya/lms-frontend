import UserDropdown from "./UserDropdown";
import { NavItem, NavLink } from "reactstrap";
import { Heart } from "react-feather";
import { useNavigate } from "react-router-dom";

const NavbarUser = () => {
  const navigate = useNavigate();

  return (
    <ul className="flex justify-between items-center space-x-6">
      <div>
          <Heart className="w-6 h-6 cursor-pointer" onClick={() => navigate("/wishlist")} />
        </div>
      <NavItem>
        <NavLink className="text-white hover:text-gray-300">
          <UserDropdown />
        </NavLink>
      </NavItem>  
    </ul>
  );
};

export default NavbarUser;
