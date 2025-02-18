import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import UserDropdown from './UserDropdown';

const NavbarUser = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={dropdownOpen}>
        User Menu
      </DropdownToggle>
      <DropdownMenu>
        <UserDropdown />
      </DropdownMenu>
    </Dropdown>
  );
};

export default NavbarUser;
