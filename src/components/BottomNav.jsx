import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">🔄</span>
        <span className="nav-label">Dönüştür</span>
      </NavLink>
      
      <NavLink to="/nasil-calisir" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">ℹ️</span>
        <span className="nav-label">Nasıl Çalışır?</span>
      </NavLink>

      <NavLink to="/gizlilik" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">🛡️</span>
        <span className="nav-label">Gizlilik</span>
      </NavLink>
      <NavLink to="/gecmis" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">🔄</span>
        <span className="nav-label">Geçmiş</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;