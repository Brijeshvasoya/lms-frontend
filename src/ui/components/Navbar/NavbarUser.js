import UserDropdown from './UserDropdown';
import { NavItem, NavLink } from 'reactstrap';

const NavbarUser = () => {
  return (
    <ul className="flex space-x-6">
      <NavItem>
        <NavLink className="text-white hover:text-gray-300">
          <UserDropdown />
        </NavLink>
      </NavItem>
    </ul>
  );
};

export default NavbarUser;
