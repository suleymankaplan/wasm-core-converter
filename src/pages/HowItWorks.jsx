import React from 'react';

const HowItWorks = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '850px', margin: '0 auto', lineHeight: '1.6', color: '#333'}}>
      
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', color: '#2c3e50' }}>Sistem Nasıl Çalışır? ⚙️</h2>
        <p style={{ fontSize: '1.1rem', color: '#7f8c8d' }}>
          Geleneksel Bulut (Cloud) mimarisinden, Modern Uç Bilişim (Edge Computing) mimarisine geçiş.
        </p>
      </header>

      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2980b9', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          1. Paradigmada Değişim: WebAssembly (Wasm) Nedir?
        </h3>
        <p>
          Geleneksel dosya dönüştürücüler (örneğin popüler çevrimiçi araçlar), dosyalarınızı uzak bir sunucuya yüklemenizi gerektirir. 
          Bu proje ise <strong>WebAssembly (WASM)</strong> teknolojisini kullanarak bu paradigmayı tamamen değiştirir. 
          WASM, C/C++ veya Rust gibi yüksek performanslı dillerle yazılmış karmaşık yazılımların (FFmpeg gibi) 
          doğrudan internet tarayıcınızın içinde, neredeyse <strong>doğal (native) hızda</strong> çalışmasına olanak tanıyan modern bir web standardıdır.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2980b9', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          2. Uç Bilişim (Edge Computing) ve Çoklu Çekirdek
        </h3>
        <p>
          Siz "İşlemi Başlat" butonuna bastığınızda, sistem dosyayı herhangi bir internet sunucusuna göndermez. 
          Bunun yerine, tarayıcınızın barındırdığı lokal işlemci gücünü kullanır. Sistemimiz, 
          <code> SharedArrayBuffer</code> ve <code>Cross-Origin Isolation</code> standartlarını destekleyerek 
          bilgisayarınızın veya telefonunuzun <strong>çoklu çekirdek (multi-threading)</strong> mimarisini kullanır. 
          Bu sayede devasa video dosyaları bile tarayıcı sekmeniz çökmadan, arka planda (Web Workers) işlenir.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2980b9', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          3. Tasarım Gereği Gizlilik (Privacy by Design)
        </h3>
        <p>
          Akademik vizyonumuzun temel taşlarından biri <strong>Sıfır Güven (Zero-Trust)</strong> modelidir. 
          Verileriniz (özel videolarınız, kişisel ses kayıtlarınız veya gizli belgeleriniz) cihazınızı asla terk etmez. 
          İnternet bağlantınızı kesseniz dahi sistem çalışmaya devam eder. Sunucuya veri transferi olmadığı için:
        </p>
        <ul style={{ marginLeft: '20px', listStyleType: 'disc' }}>
          <li style={{ marginBottom: '10px' }}>KVKK ve GDPR gibi veri koruma kanunlarına tam uyumluluk sağlanır.</li>
          <li style={{ marginBottom: '10px' }}>Yükleme (Upload) ve İndirme (Download) süreleri tamamen ortadan kalkar, işlem anında başlar.</li>
          <li style={{ marginBottom: '10px' }}>Siber saldırganların araya girip (Man-in-the-Middle) dosyalarınızı çalma ihtimali teknik olarak sıfırdır.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2980b9', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          4. Hibrit İşleme Motorları
        </h3>
        <p>
          Uygulama sadece FFmpeg ile sınırlı kalmaz, dosya tipine göre en verimli motoru dinamik olarak seçer:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #e74c3c' }}>
            <strong>🎥 Medya Motoru (FFmpeg.wasm):</strong> Video ve ses dosyaları için WebAssembly üzerinden derlenmiş medya işleme kütüphanesi.
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #f1c40f' }}>
            <strong>🖼️ Görsel Motoru (HTML5 Canvas):</strong> Resim dosyalarını dış bir kütüphaneye ihtiyaç duymadan, tarayıcının donanım hızlandırmalı (GPU-accelerated) doğal API'leri ile işler.
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #2ecc71' }}>
            <strong>📄 Doküman Motoru (PDF.js):</strong> PDF belgelerini piksel tabanlı rasterize ederek yüksek çözünürlüklü görsellere dönüştürür.
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '50px', padding: '20px', backgroundColor: '#eef2f5', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: '500', color: '#34495e' }}>
          🌱 <strong>Yeşil Bilişim (Green Computing):</strong> Bu proje, geleneksel sunucuların tükettiği devasa elektrik enerjisi ve soğutma maliyetlerini sıfıra indirerek, çevreci bir teknoloji mimarisi sunar.
        </p>
      </footer>

    </div>
  );
};

export default HowItWorks;