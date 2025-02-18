import React from 'react';
import { Home, Users, Settings } from 'react-feather';
import logo from '../../../assets/images/logo.png';

const Index = () => {
  const sidebarItems = [
    { icon: <Home />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users />, label: 'Users', path: '/users' },
    { icon: <Settings />, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white h-screen">
        <div className="flex items-center justify-center p-4">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>
        <nav className="mt-10">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
            >
              {item.icon}
              <span className="ml-4">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Index;
