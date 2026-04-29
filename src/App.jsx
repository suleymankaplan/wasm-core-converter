import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route,NavLink } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Capacitor } from '@capacitor/core';
import HowItWorks from './pages/HowItWorks';
import PrivacyPolicy from './pages/PrivacyPolicy';
import BottomNav from './components/BottomNav';
import History from './pages/History'
const Converter = lazy(() => import('./components/Converter'));

function App() {
  const [isMobile] = useState(() => Capacitor.isNativePlatform());
  return (
    <div className={`App ${isMobile?'is-mobile':''}`}>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Sistem Yükleniyor, Lütfen Bekleyin... ⚡</div>}>
              <Routes>
                <Route path="/" element={<Converter />} />
                
                <Route path="/nasil-calisir" element={<HowItWorks />} />
                
                <Route path="/gizlilik" element={<PrivacyPolicy/>} />
                <Route path='/gecmis' element={<History/>}/>
              </Routes>
            </Suspense>
          </main>
          {isMobile&&(
            <BottomNav/>
          )}
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;