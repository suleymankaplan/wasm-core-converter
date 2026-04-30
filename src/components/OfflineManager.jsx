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
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    async function verifyCache() {
      try {
        const cacheNames = await caches.keys();
        const hasCache = cacheNames.some(name => name.includes('workbox-precache'));
        
        if (hasCache) {
          const cache = await caches.open(cacheNames.find(n => n.includes('workbox-precache')));
          const requests = await cache.keys();
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

  useEffect(() => {
    let interval;
    if (!isVerifying && !offlineReady && downloadProgress < 99) {
      interval = setInterval(() => {
        setDownloadProgress((prev) => (prev < 95 ? prev + 4 : 99));
      }, 250);
    } 

    if (!isVerifying && !offlineReady && downloadProgress === 99) {
      const forceCheck = setTimeout(async () => {
        const cacheNames = await caches.keys();
        if (cacheNames.some(name => name.includes('workbox-precache'))) {
          setOfflineReady(true);
        }
      }, 2000); 
      return () => clearTimeout(forceCheck);
    }
    
    if (offlineReady) {
      setDownloadProgress(100);
    }

    return () => clearInterval(interval);
  }, [isVerifying, offlineReady, downloadProgress, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      updateServiceWorker(true);
    }
  }, [needRefresh, updateServiceWorker]);

  if (isVerifying) return null;

  return (
    <div className="pwa-status-card">
      {!offlineReady ? (
        <div className="pwa-progress-container">
          <p className="pwa-description" style={{ marginBottom: '12px', fontWeight: '500' }}>
            ⚙️ Dönüşüm motoru arka planda cihazınıza kuruluyor...
          </p>
          <div className="pwa-progress-bar-bg">
            <div 
              className="pwa-progress-bar-fill" 
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
          <p className="pwa-progress-text" style={{ marginTop: '8px', fontSize: '0.9em' }}>
            {downloadProgress < 100 
              ? `Kütüphaneler indiriliyor... %${downloadProgress}`
              : "Kurulum tamamlanıyor..."}
          </p>
        </div>
      ) : (
        <div className="pwa-success-message">
          ✅ Çevrimdışı Mod Hazır! İnternetsiz çalışabilirsiniz.
        </div>
      )}
    </div>
  );
}

export default OfflineManager;