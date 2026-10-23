import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaLeaf, FaBars, FaTimes, FaUser } from "react-icons/fa"
import { useAuth } from "../context/auth-context"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = async () => {
    try {
      await logout()
      closeMenu()
      navigate("/auth/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/predict", label: "Predict" },
    { to: "/fertilizer-advisor", label: "Fertilizer" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/about", label: "About Us" },
  ]

  return (
    <header className="kd-header">
      <nav className="kd-nav" aria-label="Main navigation">
        <div className="kd-nav-inner">
          <Link to="/" className="kd-brand" onClick={closeMenu} aria-label="KrishiDoot home">
            <span className="kd-brand-mark"><FaLeaf aria-hidden="true" /></span>
            <span>Krishi<span className="kd-brand-accent">Doot</span></span>
          </Link>

          <div className="kd-desktop-links">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="kd-nav-link">
                {item.label}
              </Link>
            ))}
            <a href="/marketplace.html" className="kd-nav-link">Marketplace</a>
            {currentUser ? (
              <div className="kd-account-menu">
                <Link to="/auth/profile" className="kd-avatar" aria-label="Open profile">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt={currentUser.displayName || "User"} />
                  ) : currentUser.displayName ? (
                    currentUser.displayName.charAt(0).toUpperCase()
                  ) : (
                    <FaUser aria-hidden="true" />
                  )}
                </Link>
                <div className="kd-account-dropdown">
                  <Link to="/auth/profile">Profile</Link>
                  <button type="button" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/auth/login" className="kd-login-link">Login</Link>
            )}
          </div>

          <button
            type="button"
            className="kd-menu-toggle"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="kd-mobile-menu">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="kd-mobile-link" onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
            <a href="/marketplace.html" className="kd-mobile-link" onClick={closeMenu}>Marketplace</a>
            {currentUser ? (
              <>
                <Link to="/auth/profile" className="kd-mobile-link" onClick={closeMenu}>Profile</Link>
                <button type="button" className="kd-mobile-logout" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/auth/login" className="kd-login-link kd-mobile-login" onClick={closeMenu}>Login</Link>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
