# WebAssembly (WASM) Core Converter 🚀

WASM Core Converter, tarayıcı üzerinde çalışan, %100 gizlilik odaklı, sunucusuz ve çevrimdışı (offline-first) evrensel bir dosya dönüştürme aracıdır. Tüm işlemler, bulut sunucuları yerine doğrudan kullanıcının cihaz donanımı kullanılarak istemci tarafında (client-side) gerçekleştirilir.

## ✨ Öne Çıkan Özellikler

*   🔒 **Tam Gizlilik:** Dosyalarınız hiçbir sunucuya yüklenmez. Tüm veri işleme süreci yerel tarayıcınızda başlar ve biter.
*   🍏 **Apple HEIC/HEIF Desteği:** İstemci tarafında `heic2any` (WASM) entegrasyonu sayesinde, iOS cihazlardan gelen inatçı formatları saniyeler içinde yerel olarak JPG/PNG'ye dönüştürür.
*   📄 **Gelişmiş PDF İşleme:** `pdf.js` motoru ile çok sayfalı PDF'ler taranır, her sayfa yüksek çözünürlüklü görsele çevrilir ve `jszip` ile tek bir ZIP dosyası olarak kullanıcıya sunulur.
*   📶 **Çevrimdışı Çalışma (PWA):** Vite-PWA ve Service Worker mimarisi sayesinde, dönüştürme motorları (yaklaşık 37 MB) ilk ziyarette arka planda (hayalet mod) cihaz belleğine alınır. Uygulama bir daha asla internet bağlantısına ihtiyaç duymaz.

## 🛠️ Kullanılan Teknolojiler

*   **Frontend:** React, Vite, CSS3
*   **WebAssembly Motorları:** `@ffmpeg/ffmpeg`, `heic2any`
*   **Edge/Native Kütüphaneler:** HTML5 Canvas (Hızlı resim işleme), `pdf.js`, `jszip`
*   **Çevrimdışı Mimari:** Vite PWA (`vite-plugin-pwa`), Workbox

## 🚀 Kurulum ve Çalıştırma

Projeyi GitHub Pages ortamında görmek için:
    https://suleymankaplan.github.io/wasm-core-converter/

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Bağımlılıkları Yükleyin
*(Not: Proje Vite 8 kullandığı için PWA eklentisi ile oluşabilecek eş bağımlılık çakışmalarını önlemek adına `--legacy-peer-deps` bayrağı gereklidir.)*
    npm install --legacy-peer-deps
### 2. Geliştirme Sunucusunu Başlatın
    npm run dev
### 3. Çevrimdışı Modu (PWA) Test Etmek İçin Üretim Derlemesi
Geliştirme modunda Service Worker devre dışı bırakılmıştır. PWA ve önbellek özelliklerini test etmek için projeyi derleyin ve önizleme alın:
    npm run build
    npm run preview
## 👨‍💻 Geliştirici
    Süleyman Kaplan
    Computer Engineering
