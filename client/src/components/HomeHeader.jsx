import React from 'react';
import Button from './ui/Button';
import { Link } from 'react-router-dom'

function HomeHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-purple-600" />
            <span className="text-gray-900">DevPortal</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
            <Link to={'/sign-in'}>
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to={'/sign-up'}>
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </nav>

          {/* Mobile */}
          <div className="md:hidden">
            <Link to={'/sign-in'}>
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}

export default HomeHeader;
