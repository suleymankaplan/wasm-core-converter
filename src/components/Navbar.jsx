import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">⚡</span>
        <h1 className="logo-text">WasmConvert</h1>
      </div>
      
      <ul className="navbar-menu">
        <li className="nav-item">
          <Link to="/" className="nav-link">Dönüştürücü</Link>
        </li>
        <li className="nav-item">
          <Link to="/nasil-calisir" className="nav-link">Nasıl Çalışır?</Link>
        </li>
        <li className="nav-item">
          <Link to="/gizlilik" className="nav-link">Gizlilik</Link>
        </li>
      </ul>
      <div className="navbar-actions">
        <a className="github-btn" href='https://github.com/suleymankaplan/wasm-core-converter' target='_blank'>GitHub</a>
      </div>
    </nav>
  );
};

export default Navbar;