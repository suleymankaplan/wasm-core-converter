import { useState, useRef,useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import './Converter.css'
import heic2any from "heic2any";
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import OfflineManager from "./OfflineManager";

const FORMAT_MAP = {
  // --- VİDEO FORMATLARI ---
  'video/mp4': { formats: ['mp4', 'mkv', 'mov', 'avi', 'flv', 'wmv', 'webm', 'mp3', 'gif'], engine: 'ffmpeg' },
  'video/x-matroska': { formats: ['mp4', 'mkv', 'mov', 'avi', 'mp3', 'gif'], engine: 'ffmpeg' }, // MKV
  'video/quicktime': { formats: ['mov', 'mp4', 'mkv', 'avi', 'mp3', 'gif'], engine: 'ffmpeg' }, // MOV
  'video/x-msvideo': { formats: ['avi', 'mp4', 'mkv', 'mp3', 'gif'], engine: 'ffmpeg' }, // AVI
  'video/x-flv': { formats: ['mp4', 'flv', 'avi'], engine: 'ffmpeg' },
  'video/webm': { formats: ['mp4', 'webm', 'gif'], engine: 'ffmpeg' },

  // --- SES FORMATLARI ---
  'audio/mpeg': { formats: ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'], engine: 'ffmpeg' }, // MP3
  'audio/wav': { formats: ['wav', 'mp3', 'ogg', 'flac', 'm4a'], engine: 'ffmpeg' },
  'audio/x-m4a': { formats: ['m4a', 'mp3', 'wav', 'flac'], engine: 'ffmpeg' },
  'audio/ogg': { formats: ['ogg', 'mp3', 'wav', 'flac'], engine: 'ffmpeg' },
  'audio/aac': { formats: ['aac', 'mp3', 'wav'], engine: 'ffmpeg' },

  // --- RESİM & ANİMASYON ---
  'image/gif': { formats: ['mp4', 'webp', 'png', 'mov'], engine: 'ffmpeg' },
  'image/png': { formats: ['webp', 'jpg', 'png'], engine: 'canvas' },
  'image/jpeg': { formats: ['webp', 'png', 'jpg'], engine: 'canvas' },
  'image/webp': { formats: ['jpg', 'png', 'webp'], engine: 'canvas' },

  // --- APPLE FORMATLARI ---
  'image/heic': { formats: ['jpg', 'png', 'webp'], engine: 'heic2any' },
  'image/heif': { formats: ['jpg', 'png', 'webp'], engine: 'heic2any' },

  // --- DOKÜMAN ---
  'application/pdf': { formats: ['jpg', 'png'], engine: 'pdfjs' }
};
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bayt';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bayt', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
const Converter = () => {
  const [file, setFile] = useState(null);
  const [allowedFormats, setAllowedFormats] = useState([]);
  const [selectedOutput, setSelectedOutput] = useState("");
  const [activeEngine, setActiveEngine] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress,setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const ffmpegRef = useRef(new FFmpeg());
  const [loadProgress,setLoadProgress]=useState(0);

const loadSpecificEngine = async (type) => {
  if (activeEngine === type) return;

  setLoadingMsg(`${type.toUpperCase()} kütüphanesi indiriliyor...`);
  setLoadProgress(0);

  if (type === "ffmpeg") {
    const baseURL = import.meta.env.BASE_URL + 'ffmpeg';
    const ffmpeg = ffmpegRef.current;

    const downloadWithProgress = async (url) => {
      const response = await fetch(url);
      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');
      
      let receivedLength = 0;
      let chunks = [];
      
      while(true) {
        const {done, value} = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        
        const percent = Math.round((receivedLength / contentLength) * 100);
        setLoadProgress(percent);
      }
      
      let chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for(let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }
      
      return URL.createObjectURL(new Blob([chunksAll], { type: url.endsWith('.wasm') ? 'application/wasm' : 'text/javascript' }));
    };

    try {
      const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
      const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');
      
      const wasmURL = await downloadWithProgress(`${baseURL}/ffmpeg-core.wasm`);

      await ffmpeg.load({ coreURL, wasmURL, workerURL });
      setActiveEngine("ffmpeg");
      setLoadingMsg("Motor Hazır! 🚀");
      URL.revokeObjectURL(coreURL);
      URL.revokeObjectURL(workerURL);
      URL.revokeObjectURL(wasmURL);
    } catch (e) {
      console.log("Yükleme başarısız: ",e);
      setLoadingMsg("Yükleme başarısız ❌");
    }
  }
  else if(type==="canvas"){
    setActiveEngine("canvas");
    setLoadingMsg("Resim Motoru Hazır! 🖼️ (Native Edge)");
  }
  else if (type === "heic2any") {
      setActiveEngine("heic2any");
      setLoadingMsg("HEIC Apple Motoru Hazır! 🍏 (WASM)");
    }
  else if (type === "pdfjs") {
    try {
      // Vite'ın base URL'ini alıyoruz (Örn: /wasm-core-converter/ veya /)
      const baseUrl = import.meta.env.BASE_URL;
      
      const scripts = [
        `${baseUrl}pdfjs/pdf.min.js`,
        `${baseUrl}pdfjs/jszip.min.js`
      ];

      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      Promise.all(scripts.map(loadScript)).then(() => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${baseUrl}pdfjs/pdf.worker.min.js`;
          setActiveEngine("pdfjs");
          setLoadingMsg("PDF & ZIP Motoru Hazır! 📄📦");
        }
      }).catch(() => {
        setLoadingMsg("Kütüphane dosyaları bulunamadı ❌");
      });

    } catch (error) {
      console.error("PDF Motoru hatası:", error);
      setLoadingMsg("PDF Motoru yüklenemedi ❌");
    }
  }
};
const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setProcessing(false);
    setProgress(0);
    setStatus("");

    let type = selectedFile.type;
    const inputExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!type || type === '' || type === 'application/octet-stream') {
      if (inputExtension === 'heic' || inputExtension === 'heif') {
        type = 'image/heic';
      }
    }
    let config = FORMAT_MAP[type];
    if (!config) {
      if (type.startsWith('video/') || type.startsWith('audio/')) {
        config = { formats: ['mp4', 'mkv', 'mp3'], engine: 'ffmpeg' };
      } else if (type.startsWith('image/')) {
        config = { formats: ['webp', 'jpg', 'png'], engine: 'canvas' };
      } else if (type === 'application/pdf') {
        config = { formats: ['jpg', 'png'], engine: 'pdfjs' };
      } else {
        alert("Üzgünüm, bu dosya türünü desteklemiyoruz.");
        setFile(null);
        return; 
      }
    }
    const filteredFormats = config.formats.filter(fmt => fmt !== inputExtension);
    setAllowedFormats(filteredFormats);
    setSelectedOutput(filteredFormats[0] || "");
    loadSpecificEngine(config.engine);
  };
const convertFile = async () => {
  if (!file || !selectedOutput) return;

  setProcessing(true);
  setProgress(0);
  setStatus("Processing");
  
  const ffmpeg = ffmpegRef.current;
  let inputName = '';
  let outputName = '';
  
  try {
    const cleanFileName = file.name.replace(/[^\w.-]/g, '_');
    inputName = `input_${Date.now()}_${cleanFileName}`;
    outputName = `output_${Date.now()}.${selectedOutput}`;

    if (activeEngine === "ffmpeg") {
      ffmpeg.off('progress');
      ffmpeg.on('progress', ({ progress }) => {
        if (progress >= 0 && progress <= 1) setProgress(Math.round(progress * 100));
      });
      
      console.log("Dosya yazılıyor...");
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      
      let command = [];
      if (selectedOutput === 'png' || selectedOutput === 'jpg') {
        command = ['-i', inputName, '-vframes', '1', outputName];
      } else if (selectedOutput === 'gif') {
        command = ['-i', inputName, '-vf', 'fps=10,scale=320:-1:flags=lanczos', outputName];
      } else {
        command = ['-i', inputName, outputName];
      }
      
      console.log("FFmpeg başlatılıyor:", command);
      const result = await ffmpeg.exec(command);
      if (result !== 0) throw new Error("FFmpeg işlemi başarısız oldu.");
      
      setStatus("Downloading");
      const data = await ffmpeg.readFile(outputName);
      
      let mimeType = "";
    switch (selectedOutput) {
      case 'gif': mimeType = 'image/gif'; break;
      case 'mp3': mimeType = 'audio/mpeg'; break;
      case 'png': mimeType = 'image/png'; break;
      case 'jpg': mimeType = 'image/jpeg'; break;
      case 'webp': mimeType = 'image/webp'; break;
    default: mimeType = `video/${selectedOutput}`;
  }
      
      const url = URL.createObjectURL(new Blob([data.buffer], { type: mimeType }));
      triggerDownload(url, outputName);

    } else if (activeEngine === "canvas") {
      setProgress(50);
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const targetMime = selectedOutput === 'jpg' ? 'image/jpeg' : `image/${selectedOutput}`;
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          triggerDownload(url, outputName);
          setProgress(100);
          URL.revokeObjectURL(img.src);
        }, targetMime, 0.9);
      };
      
    } else if (activeEngine === "heic2any") {
        setProgress(30);
        const targetMime = selectedOutput === 'jpg' ? 'image/jpeg' : `image/${selectedOutput}`;
        
        const conversionResult = await heic2any({
          blob: file,
          toType: targetMime,
          quality: 0.9,
        });

        setProgress(80);
        
        const finalBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
        
        const url = URL.createObjectURL(finalBlob);
        triggerDownload(url, outputName);
        setProgress(100);

      } else if (activeEngine === "pdfjs") {
      const fileReader = new FileReader();
      fileReader.onload = async function() {
        const typedarray = new Uint8Array(this.result);
        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
        const totalPages = pdf.numPages;
        const zip = new window.JSZip();
        
        console.log(`${totalPages} sayfa işleniyor...`);

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({ canvasContext: ctx, viewport: viewport }).promise;
          const imgBlob = await new Promise(resolve => 
            canvas.toBlob(resolve, selectedOutput === 'jpg' ? 'image/jpeg' : 'image/png', 0.9)
          );
          
          zip.file(`sayfa_${i}.${selectedOutput}`, imgBlob);
          
          setProgress(Math.round((i / totalPages) * 100));
        }

        const zipContent = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipContent);
        triggerDownload(url, `tum_sayfalar.zip`);
        
        setStatus("Done");
        setProgress(100);
      };
      fileReader.readAsArrayBuffer(file);
    }

  } catch (error) {
    console.error("DETAYLI HATA:", error);
    setStatus("Error");
    alert("İşlem sırasında bir hata oluştu.");
  } finally {
    setProcessing(false);
    if (activeEngine === "ffmpeg") {
      try {
        if (inputName) await ffmpeg.deleteFile(inputName);
        if (outputName) await ffmpeg.deleteFile(outputName);
      } catch { /* */ }
    }
  }
};

const triggerDownload = async (url, filename) => {
  setStatus("Done");

  // MOBİL KONTROLÜ
  if (Capacitor.isNativePlatform()) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = reader.result;

        const savedFile = await Filesystem.writeFile({
          path: filename,
          data: base64Data,
          directory: Directory.Cache
        });

        await Share.share({
          title: 'Dosyan Hazır!',
          url: savedFile.uri,
        });
      };
    } catch (error) {
      console.error("Mobil paylaşım hatası:", error);
    }
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_${filename}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};
  const resetConverter = () => {
    setFile(null);
    setStatus("");
    setProgress(0);
    setAllowedFormats([]);
    setSelectedOutput("");
  };
  useEffect(() => {
    if (!window.crossOriginIsolated) {
    console.warn(
      "DIKKAT: Uygulama Cross-Origin Isolated modunda DEĞİL. " +
      "SharedArrayBuffer kullanılamaz, FFmpeg tek çekirdekte (yavaş) çalışacaktır. " +
      "Lütfen COOP ve COEP başlıklarını ayarlayın."
    );
  } else {
    console.log("Sistem Cross-Origin Isolated modunda. Multi-threading aktif edilebilir.");
  }
  return () => {
    if (ffmpegRef.current) {
      ffmpegRef.current.off('progress'); 
      try {
          ffmpegRef.current.terminate();
        } catch {
          console.warn("FFmpeg zaten kapalı veya sonlandırılamadı.");
        }
    }
  };
}, []);

  return (
    <>
    <OfflineManager/>
    <div className="converter-container">
      {file&&(
          <button className="change-file-button" onClick={resetConverter}>
                X
          </button>
      )}
      <h2 className="converter-title">WebAssembly Converter</h2>
        
      {/* Giriş Alanı */}

        {!file&&(
          <div className="file-input-wrapper">
          <input type="file" className="file-input" onChange={handleFileChange} disabled={processing} />
      </div>)}
      

      {file && (
        
        <div className="processing-zone">
          <p className="file-info">
            Seçilen Dosya: <strong className="file-name">{file.name}</strong>
            <span className="file-size"> ({formatBytes(file.size)})</span>
          </p>
          
          <div className="format-selector-wrapper">
            <label className="format-label">Dönüştürülecek Format: </label>
            <select 
              className="format-select"
              value={selectedOutput} 
              onChange={(e) => setSelectedOutput(e.target.value)}
              disabled={processing}
            >
              {allowedFormats.map(fmt => (
                <option key={fmt} value={fmt} className="format-option">{fmt.toUpperCase()}</option>
              ))}
            </select>
          </div>
          {!activeEngine && loadProgress > 0 && (
            <div className="engine-load-status">
              <p className="load-percentage">
                Sistem Motoru İndiriliyor: %{loadProgress}
              </p>
              <div className="load-progress-bar-wrapper">
                <div 
                  className="load-progress-bar"
                  style={{ width: `${loadProgress}%` }} 
                />
              </div>
              <small className="load-note">Bu işlem internet hızınıza bağlı olarak bir kez yapılacaktır.</small>
            </div>
          )}
          <p className="loading-message">{loadingMsg}</p>

          <button 
            className={`convert-button ${!activeEngine || processing ||status=='Done'? 'disabled' : 'active'}`}
            onClick={convertFile} 
            disabled={!activeEngine || processing||status=='Done'}
          >
            
            {processing ? 'Dönüştürülüyor...' : 'İşlemi Başlat'}
          </button>
          <div className="operation-status-wrapper">
            <p className="status-text">
              {status==="Processing"&&`Dönüştürülüyor %${progress}`}
              {status==="Finalizing"&&'Dosya hazırlanıyor...'}
              {status==="Downloading"&&"İndirme başlatılıyor..."}
              {status==="Done"&&"İndirme başarılı"}
            </p>
            {(status!='Done'&&status!="")&&(
              <div className="operation-progress-bar-wrapper">
              <div 
                className={`operation-progress-bar ${status === "Done" ? 'done' : 'processing'}`}
                style={{ width: `${progress}%` }} 
              />
            </div>
            )}
            
          </div>
          {status==="Done"&&(
            <button className="reset-button" onClick={resetConverter}>Daha fazla dönüştür</button>
          )}
          
        </div>
      )}
      <footer className="converter-footer">
        🔒 Dosyalarınız sunucuya gönderilmez, işlem tarayıcınızda yapılır.
      </footer>
    </div>
    </>
  );   
}

export default Converter;