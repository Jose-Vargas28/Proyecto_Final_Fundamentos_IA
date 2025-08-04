import ImageClassifier from "./components/ImageClassifier";
import TextToSpeech from "./components/TextToSpeech";
import VoiceRecognition from "./components/VoiceRecognition";


export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '40px 20px',
      background: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ marginBottom: 30 }}>Asistente Visual-Auditivo</h1>

      <ImageClassifier />
      <VoiceRecognition />
      <TextToSpeech />
    
      <footer style={{ marginTop: 50, fontSize: '0.9rem', color: '#777' }}>
        © 2025 Proyecto IA – Fundamentos De Inteligencia Artificial - ESFOT
      </footer>
    </div>
  );
}

