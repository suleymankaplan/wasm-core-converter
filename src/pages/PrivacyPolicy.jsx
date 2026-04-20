import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '850px', margin: '0 auto', lineHeight: '1.6', color: '#333' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', color: '#2c3e50' }}>Gizlilik ve Veri Güvenliği 🛡️</h2>
        <p style={{ fontSize: '1.1rem', color: '#7f8c8d' }}>
          Sıfır Veri Transferi, Maksimum Şeffaflık.
        </p>
      </header>

      <section style={{ marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #2ecc71' }}>
        <h3 style={{ color: '#27ae60', marginTop: 0 }}>TL;DR (Kısaca)</h3>
        <p style={{ margin: 0, fontWeight: '500' }}>
          Dosyalarınız <strong>asla</strong> sunucularımıza yüklenmez. Tüm dönüştürme işlemleri bilgisayarınızın RAM'i (belleği) içinde, sadece o an açık olan tarayıcı sekmesinde gerçekleşir. Sekmeyi kapattığınız an tüm verileriniz dijital dünyadan kalıcı olarak silinir.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2980b9', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          1. Tasarım Gereği Gizlilik (Privacy by Design)
        </h3>
        <p>
          Uygulamamız, modern yazılım mühendisliğindeki "Privacy by Design" ilkesi üzerine inşa edilmiştir. 
          Geleneksel platformların aksine, sistemimiz kullanıcı verilerini korumak için "şifreleme" (encryption) yöntemlerine güvenmez; 
          bunun yerine veriyi <strong>hiç toplamama</strong> (zero-data collection) yolunu seçer. Sizin cihazınızdan bizim sunucularımıza 
          giden hiçbir dosya akışı yoktur.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2980b9', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          2. WebAssembly ve Uç İşleme (Edge-Processing)
        </h3>
        <p>
          Uygulama, WebAssembly (WASM) teknolojisini kullanarak kendi tarayıcınızı kapalı bir işlem kutusuna (sandbox) dönüştürür. 
        </p>
        <ul style={{ marginLeft: '20px', listStyleType: 'disc' }}>
          <li style={{ marginBottom: '10px' }}><strong>Geçici Bellek Kullanımı:</strong> Seçtiğiniz dosyalar sadece geçici olarak tarayıcınızın belleğine (Virtual File System) alınır.</li>
          <li style={{ marginBottom: '10px' }}><strong>İzole Ortam:</strong> Sistem <code>Cross-Origin-Opener-Policy (COOP)</code> ve <code>Cross-Origin-Embedder-Policy (COEP)</code> başlıkları ile korunur. Bu sayede tarayıcınızdaki diğer sekmeler veya zararlı yazılımlar işlem gören dosyalarınıza erişemez.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2980b9', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          3. KVKK ve GDPR Uyumluluğu (Bypass Mimarisi)
        </h3>
        <p>
          Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Genel Veri Koruma Tüzüğü (GDPR), kullanıcı verilerini işleyen 
          sunucular için katı kurallar koyar. Ancak mimarimiz, <strong>"Veri Sorumlusu" (Data Controller)</strong> ve 
          <strong>"Veri İşleyen" (Data Processor)</strong> rollerini tamamen ortadan kaldırır. Biz hiçbir verinize sahip olmadığımız 
          veya işlemediğimiz için, veri sızıntısı (data breach) ihtimali teknik ve fiziksel olarak %0'dır. En yüksek regülasyon 
          standartlarını, regülasyonun kapsamından çıkarak (by-pass) sağlıyoruz.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2980b9', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          4. Çerezler (Cookies) ve İzleme
        </h3>
        <p>
          Bu uygulama reklam amaçlı çerezler, üçüncü parti takip pikselleri veya davranışsal analiz (analytics) araçları kullanmaz. 
          Ne dönüştürdüğünüzü, dosyanızın içeriğini veya boyutunu bilmiyoruz ve ilgilenmiyoruz. 
        </p>
      </section>

      <footer style={{ marginTop: '50px', padding: '20px', backgroundColor: '#eef2f5', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: '500', color: '#34495e' }}>
          🔒 Bilgisayarınızın internet bağlantısını kestiğinizde bile (Uçak Modu) bu sistemin kusursuz çalıştığını test ederek 
          kendi veri güvenliğinizi teyit edebilirsiniz.
        </p>
      </footer>

    </div>
  );
};

export default PrivacyPolicy;