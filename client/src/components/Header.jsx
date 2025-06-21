import { Link, useLocation } from "wouter";
import { useState } from "react";
import CurrentDateTime from "./CurrentDateTime";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="medical-header">
      <div className="medical-header-content">
        <div className="header-left">
          <div className="medical-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" className="medicine-icon">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                <circle cx="12" cy="12" r="3" fill="white" opacity="0.9"/>
                <rect x="10.5" y="9" width="3" height="6" rx="1.5" fill="currentColor"/>
                <rect x="9" y="10.5" width="6" height="3" rx="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="logo-text">MediTrack</span>
          </div>
          <CurrentDateTime />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        {/* Desktop navigation */}
        <nav className="desktop-nav">
          <ul className="medical-nav">
            <li>
              <Link 
                href="/" 
                className={isActive("/") ? "active" : ""}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/scanner" 
                className={isActive("/scanner") ? "active" : ""}
              >
                Scan Medicine
              </Link>
            </li>
            <li>
              <Link 
                href="/inventory" 
                className={isActive("/inventory") ? "active" : ""}
              >
                Inventory
              </Link>
            </li>
            <li>
              <Link 
                href="/donations" 
                className={isActive("/donations") ? "active" : ""}
              >
                Donations
              </Link>
            </li>
            <li>
              <Link 
                href="/admin" 
                className={isActive("/admin") ? "active" : ""}
              >
                Admin
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav-overlay" onClick={closeMobileMenu}>
            <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
              <ul className="mobile-nav-list">
                <li>
                  <Link 
                    href="/" 
                    className={isActive("/") ? "active" : ""}
                    onClick={closeMobileMenu}
                  >
                    <i className="fas fa-chart-line"></i>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/scanner" 
                    className={isActive("/scanner") ? "active" : ""}
                    onClick={closeMobileMenu}
                  >
                    <i className="fas fa-qrcode"></i>
                    Scan Medicine
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/inventory" 
                    className={isActive("/inventory") ? "active" : ""}
                    onClick={closeMobileMenu}
                  >
                    <i className="fas fa-boxes"></i>
                    Inventory
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/donations" 
                    className={isActive("/donations") ? "active" : ""}
                    onClick={closeMobileMenu}
                  >
                    <i className="fas fa-heart"></i>
                    Donations
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin" 
                    className={isActive("/admin") ? "active" : ""}
                    onClick={closeMobileMenu}
                  >
                    <i className="fas fa-cog"></i>
                    Admin
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
