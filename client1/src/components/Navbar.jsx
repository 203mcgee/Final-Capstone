import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from "../pages/LoginPage.jsx";
import Register from "../pages/RegisterForm.jsx"

function Navbar() {
  const location = useLocation();
  // Returns the current Location. 

  const getLinkStyles = (path) => {
    const isActive = location.pathname === path;
    return `px-.5 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? 'text-black bg-gray-200 font-bold'
        : 'text-black hover:text-black hover:bg-gray-100'
    }`;
  };

//   Kept <Link> Tags: Used useLocation().pathname to manually check active paths without replacing <Link> with <NavLink>.

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="flex justify-center items-center gap-4 py-3 px-4 max-w-4xl mx-auto flex-wrap text-sm md:text-base font-medium">
        <Link to="/" className={getLinkStyles('/')}>
          Home
        </Link>
        <span className="text-gray-300">|</span>

        <Link to="/projects" className={getLinkStyles('/projects')}>
          Projects
        </Link>
        <span className="text-gray-300">|</span>

        <Link to="/experience" className={getLinkStyles('/experience')}>
          Experience & Skills
        </Link>
        <span className="text-gray-300">|</span>

        <Link to="/contact" className={getLinkStyles('/contact')}>
          Contact
        </Link>
        <Link to="/login" className={getLinkStyles('/login')}>
          login
        </Link>
        <Link to="/register" className={getLinkStyles('/register')}>
          register
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;