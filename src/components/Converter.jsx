import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect } from "react";

const FORMAT_MAP = {
  'video/mp4': { formats: ['mp4', 'mkv', 'mov', 'avi', 'mp3', 'gif'], engine: 'ffmpeg' },
  'video/quicktime': { formats: ['mov', 'mp4', 'mp3', 'avi', 'gif'], engine: 'ffmpeg' },
  'audio/mpeg': { formats: ['mp3', 'wav', 'ogg', 'aac', 'flac'], engine: 'ffmpeg' },
  'audio/wav': { formats: ['wav', 'mp3', 'ogg', 'flac'], engine: 'ffmpeg' },
  'image/gif': { formats: ['mp4', 'webp', 'png'], engine: 'ffmpeg' },
  'image/png': { formats: ['webp', 'jpg'], engine: 'squoosh' },
  'application/pdf': { formats: ['jpg', 'png'], engine: 'pdf-lib' }
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
    const baseURL = window.location.origin + '/ffmpeg';
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
    } catch (e) {
      setLoadingMsg("Yükleme başarısız ❌",e);
    }
  }
};
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const type = selectedFile.type;
    let config = FORMAT_MAP[type];
    const inputExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!config) {
    if (type.startsWith('video/') || type.startsWith('audio/')) {
      config = { formats: ['mp4', 'mp3'], engine: 'ffmpeg' };
    } else {
      alert("Üzgünüm, bu dosya türünü desteklemiyoruz (Resim, Video veya Ses olmalı).");
      setFile(null);
      return; 
    }
  }
  const filteredFormats = config.formats.filter(fmt => fmt !== inputExtension);
    setAllowedFormats(filteredFormats);
    setSelectedOutput(filteredFormats[0]);
    loadSpecificEngine(config.engine);
  };
const convertFile = async () => {
  if (!file || !selectedOutput) return;

  setProcessing(true);
  setProgress(0);
  setStatus("Processing");

  try {
    const ffmpeg = ffmpegRef.current;
    const cleanFileName = file.name.replace(/[^\w.-]/g, '_');
    const inputName = `input_${cleanFileName}`;
    const outputName = `output_${Date.now()}.${selectedOutput}`;
    ffmpeg.off('progress');
    ffmpeg.on('progress', ({ progress }) => {
      if (progress >= 0 && progress <= 1) {
        setProgress(Math.round(progress * 100));
      }
    });
    console.log("Dosya yazılıyor...");
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    let command = [];
    if (selectedOutput === 'gif') {
      command = [
        '-i', inputName,
        '-vf', 'fps=10,scale=320:-1:flags=lanczos', 
        outputName
      ];
    } else {
      command = ['-i', inputName, outputName];
    }
    console.log("FFmpeg başlatılıyor:", command);
    const result = await ffmpeg.exec(command);
    if (result !== 0) {
      throw new Error("FFmpeg işlemi başarısız oldu.");
    }
    setStatus("Downloading");
    const data = await ffmpeg.readFile(outputName);
    const mimeType = selectedOutput === 'gif' ? 'image/gif' : 
                 selectedOutput === 'mp3' ? 'audio/mpeg' : 
                 `video/${selectedOutput}`;
    const url = URL.createObjectURL(new Blob([data.buffer],{type:mimeType}));
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_${Date.now()}.${selectedOutput}`;
    a.click();
    
    setStatus("Done");
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

  } catch (error) {
    console.error("DETAYLI HATA:", error);
    setStatus("Error");
    alert("Dönüştürme sırasında bir hata oluştu. Lütfen dosyanın çok büyük olmadığından emin olun.");
  } finally {
    setProcessing(false);
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
  return () => {
    if (ffmpegRef.current) {
      ffmpegRef.current.off('progress'); 
    }
  };
}, []);

  return (
    <div className="converter-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>WebAssembly Converter</h2>
      
      {/* Giriş Alanı */}
      <div style={{ marginBottom: '20px' }}>
        <input type="file" onChange={handleFileChange} disabled={processing} key={file ? 'active-upload' : 'new-upload'} />
      </div>

      {file && (
        <div className="processing-zone" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
          <p>Seçilen Dosya: <strong>{file.name}</strong></p>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Dönüştürülecek Format: </label>
            <select 
              value={selectedOutput} 
              onChange={(e) => setSelectedOutput(e.target.value)}
              disabled={processing}
            >
              {allowedFormats.map(fmt => (
                <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
              ))}
            </select>
          </div>
          {!activeEngine && loadProgress > 0 && (
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #3498db', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.9rem', color: '#3498db' }}>
                Sistem Motoru İndiriliyor: %{loadProgress}
              </p>
              <div style={{ width: '100%', backgroundColor: '#f0f0f0', height: '8px', borderRadius: '4px' }}>
                <div style={{ 
                  width: `${loadProgress}%`, 
                  backgroundColor: '#3498db', 
                  height: '100%', 
                  transition: 'width 0.2s' 
                }} />
              </div>
              <small style={{ color: '#888' }}>Bu işlem internet hızınıza bağlı olarak bir kez yapılacaktır.</small>
            </div>
          )}
          <p style={{ fontSize: '0.85rem', color: '#555' }}>{loadingMsg}</p>

          <button 
            onClick={convertFile} 
            disabled={!activeEngine || processing}
            style={{ padding: '10px 20px', backgroundColor: activeEngine ? '#4CAF50' : '#ccc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {processing ? 'Dönüştürülüyor...' : 'İşlemi Başlat'}
          </button>
          <div style={{ width: '100%', marginTop: '20px' }}>
            <p>
              {status==="Processing"&&`Dönüştürülüyor %${progress}`}
              {status==="Finalizing"&&'Dosya hazırlanıyor...'}
              {status==="Downloading"&&"İndirme başlatılıyor..."}
              {status==="Done"&&"İndirme başarılı"}
            </p>
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '10px', 
              height: '10px',
              overflow: 'hidden' 
            }}>
              <div style={{ 
                width: `${progress}%`,
                transition: 'width 0.3s ease',
                backgroundColor: status==="Done"?'#747474':'#4caf50', 
                height: '100%'
              }} />
            </div>
          </div>
          {status==="Done"&&(
            <button onClick={resetConverter} style={{ padding: '10px 20px', backgroundColor:'#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '10px'}}>Daha fazla dönüştür</button>
          )}
          
        </div>
      )}

      <footer style={{ marginTop: '30px', color: '#888', fontSize: '0.8rem' }}>
        🔒 Dosyalarınız sunucuya gönderilmez, işlem tarayıcınızda yapılır.
      </footer>
    </div>
  );   
}

export default Converter;