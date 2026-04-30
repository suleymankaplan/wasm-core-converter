import React, { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import './OfflineManager.css';

function OfflineManager() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // 1. MEVCUT DURUMU KONTROL ET
  useEffect(() => {
    async function verifyCache() {
      try {
        const cacheNames = await caches.keys();
        const hasCache = cacheNames.some(name => name.includes('workbox-precache'));
        
        if (hasCache) {
          const cache = await caches.open(cacheNames.find(n => n.includes('workbox-precache')));
          const requests = await cache.keys();
          // Eğer 5'ten fazla dosya varsa inmiş kabul et
          if (requests.length > 5) {
            setOfflineReady(true);
          }
        }
      } catch (err) {
        console.warn("Önbellek kontrolünde hata:", err);
      } finally {
        setIsVerifying(false);
      }
    }
    verifyCache();
  }, [setOfflineReady]);

  // 2. %99 TAKILMASINI ÇÖZEN BAR MANTIĞI
  useEffect(() => {
    let interval;
    if (isDownloading && downloadProgress < 99) {
      interval = setInterval(() => {
        setDownloadProgress((prev) => (prev < 95 ? prev + 3 : 99));
      }, 200);
    } 

    // KRİTİK: Eğer %99'da takılırsa 2 saniye sonra Cache'i manuel kontrol et
    if (isDownloading && downloadProgress === 99 && !offlineReady) {
      const forceCheck = setTimeout(async () => {
        const cacheNames = await caches.keys();
        if (cacheNames.some(name => name.includes('workbox-precache'))) {
          // Dosyalar oradaysa SW'den offlineReady gelmese bile hazır yap
          setOfflineReady(true);
          console.log("Sistem hazır, %99 takılması aşıldı.");
        }
      }, 2000); 
      return () => clearTimeout(forceCheck);
    }
    
    // İşlem bittiğinde
    if (offlineReady && isDownloading) {
      setDownloadProgress(100);
      const timer = setTimeout(() => setIsDownloading(false), 800);
      return () => clearTimeout(timer);
    }

    return () => clearInterval(interval);
  }, [isDownloading, downloadProgress, offlineReady, setOfflineReady]);

  const handleDownloadCore = () => {
    if (needRefresh) {
      updateServiceWorker(true);
    } else {
      setIsDownloading(true);
      // PWA zaten arka planda inmeye başladı, biz sadece görseli başlattık
    }
  };

  if (isVerifying) return null;

  return (
    <div className="pwa-status-card">
      {!offlineReady && (
        <>
          <p className="pwa-description">
            Tüm dönüşüm motorunu yerel tarayıcınıza indirin. İndirme bittikten sonra internetinizi kapatıp güvenle devam edebilirsiniz.
          </p>
          {!isDownloading ? (
            <button className="pwa-download-btn" onClick={handleDownloadCore}>
              Motoru ve Kütüphaneleri İndir
            </button>
          ) : (
            <div className="pwa-progress-container">
              <div className="pwa-progress-bar-bg">
                <div 
                  className="pwa-progress-bar-fill" 
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
              <p className="pwa-progress-text">
                {downloadProgress < 100 
                  ? `Motor dosyaları önbelleğe alınıyor... %${downloadProgress}`
                  : "Kurulum tamamlanıyor..."}
              </p>
            </div>
          )}
        </>
      )}

      {offlineReady && (
        <div className="pwa-success-message">
          ✅ Sistem Çevrimdışı Hazır! Cihazınızda yerel olarak çalışıyor.
        </div>
      )}
    </div>
  );
}

export default OfflineManager;