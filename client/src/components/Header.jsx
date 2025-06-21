import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  const isActive = (path) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="medical-header">
      <div className="medical-header-content">
        <div className="medical-logo">
          <i className="fas fa-pills"></i>
          MediTrack
        </div>
        <nav>
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
      </div>
    </header>
  );
}
