import { useState } from "react";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header>
      <div className="container">
        <nav>
          <a href="#home" className="logo" onClick={closeMenu}>
            <img src="/images/logoo.png" alt="Yatra Technologies" />
          </a>

          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#contact" className="nav-button" onClick={closeMenu}>
              Let's Talk
            </a>
          </div>

          <button
            className="menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;