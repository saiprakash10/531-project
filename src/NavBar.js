import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex items-center justify-between w-full max-w-2xl mx-auto">
        <li>
          <Link to="/" className="text-white no-underline hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
            Home
          </Link>
        </li>
        {/* White vertical line separator */}
        <li className="border-r border-white h-6"></li>
        <li>
          <Link to="/Graphs" className="text-white no-underline hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
            Graphs
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
