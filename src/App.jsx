import { lazy, Suspense } from 'react';
const Converter=lazy(()=>import('./components/Converter'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Sayfa Yükleniyor, Lütfen Bekleyin</div>}>
      <Converter />
      </Suspense>
      
    </div>
  );
}
export default App;