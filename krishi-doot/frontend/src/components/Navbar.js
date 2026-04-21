"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaLeaf, FaBars, FaTimes, FaUser } from "react-icons/fa"
import { useAuth } from "../context/auth-context"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/auth/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <FaLeaf className="text-green-500 text-2xl mr-2" />
            <span className="text-xl font-bold">KrishiDoot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-500 font-medium">
              Home
            </Link>
            <Link to="/predict" className="text-gray-700 hover:text-green-500 font-medium">
              Predict
            </Link>
            <Link to="/fertilizer-advisor" className="text-gray-700 hover:text-green-500 font-medium">
              Fertilizer
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-green-500 font-medium">
              Dashboard
            </Link>
            <a
              href="/marketplace.html"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-green-500 font-medium transition"
            >
              Marketplace
            </a>
            <Link to="/about" className="text-gray-700 hover:text-green-500 font-medium">
              About Us
            </Link>

            {currentUser ? (
              <div className="relative group">
                <Link to="/auth/profile" className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 overflow-hidden">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL || "/placeholder.svg"}
                        alt={currentUser.displayName || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : currentUser.displayName ? (
                      currentUser.displayName.charAt(0).toUpperCase()
                    ) : (
                      <FaUser />
                    )}
                  </div>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to="/auth/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth/login" className="btn">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-500 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-green-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/predict"
                className="text-gray-700 hover:text-green-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Predict
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-green-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-green-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>

              {currentUser ? (
                <>
                  <Link
                    to="/auth/profile"
                    className="text-gray-700 hover:text-green-500 font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-2 overflow-hidden">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL || "/placeholder.svg"}
                          alt={currentUser.displayName || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : currentUser.displayName ? (
                        currentUser.displayName.charAt(0).toUpperCase()
                      ) : (
                        <FaUser size={16} />
                      )}
                    </div>
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="text-red-500 hover:text-red-600 font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  className="btn inline-block w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
