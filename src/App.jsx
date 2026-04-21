import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route,NavLink } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Capacitor } from '@capacitor/core';
import HowItWorks from './pages/HowItWorks';
import PrivacyPolicy from './pages/PrivacyPolicy';
const Converter = lazy(() => import('./components/Converter'));

function App() {
  const [isMobile] = useState(() => Capacitor.isNativePlatform());
  return (
    <div className={`App ${isMobile?'is-mobile':''}`}>
      <BrowserRouter>
        <div className="app-container">
          {!isMobile&&(
            <Navbar />
          )} 
          

          <main className="main-content">
            <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Sistem Yükleniyor, Lütfen Bekleyin... ⚡</div>}>
              <Routes>
                <Route path="/" element={<Converter />} />
                
                <Route path="/nasil-calisir" element={<HowItWorks />} />
                
                <Route path="/gizlilik" element={<PrivacyPolicy/>} />
              </Routes>
            </Suspense>
          </main>
          {/* {isMobile && (
            <nav className="bottom-nav">
              <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">🔄</span>
                <span className="nav-label">Dönüştür</span>
              </NavLink>
              
              <NavLink to="/gecmis" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">📜</span>
                <span className="nav-label">Geçmiş</span>
              </NavLink>
            </nav>
          )} */}
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;