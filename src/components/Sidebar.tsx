'use client';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Users', path: '/Users' },
    { name: 'Content', path: '/Content' },
    { name: 'Analytics', path: '/Analytics' },
    { name: 'Block Chain', path: '/Block-Chain' }
  ];

  return (
    <div>
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-xs md:text-lg text-white shadow-lg z-30">
        <ul className="flex flex-col items-start p-6 space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className={`block font-bold duration-200 hover:text-orange-400 ${pathname === item.path ? 'text-orange-500' : 'text-gray-200'}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 text-black bg-white p-2 rounded-full shadow-lg lg:hidden ${isSidebarOpen ? 'hidden' : ''}`}
      >
        <FaBars className="text-xl" />
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-xs md:text-lg text-white shadow-lg z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleSidebar}
            className="duration-200 hover:text-orange-400"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        <ul className="flex flex-col items-start p-6 space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className={`block duration-200 hover:text-orange-400 ${pathname === item.path ? 'text-orange-500' : 'text-gray-200'}`}
                onClick={handleLinkClick} 
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
