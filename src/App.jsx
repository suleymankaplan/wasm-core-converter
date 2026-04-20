import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HowItWorks from './pages/HowItWorks';
import PrivacyPolicy from './pages/PrivacyPolicy';
const Converter = lazy(() => import('./components/Converter'));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="app-container">
          <Navbar />

          <main className="main-content">
            <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Sistem Yükleniyor, Lütfen Bekleyin... ⚡</div>}>
              <Routes>
                <Route path="/" element={<Converter />} />
                
                <Route path="/nasil-calisir" element={<HowItWorks />} />
                
                <Route path="/gizlilik" element={<PrivacyPolicy/>} />
              </Routes>
            </Suspense>
          </main>
          
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;