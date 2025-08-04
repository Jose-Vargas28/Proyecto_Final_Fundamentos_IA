import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";

export default function VoiceRecognition() {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      console.log("Texto detectado:", speechResult);
      setTranscript(speechResult);
      ejecutarComando(speechResult);
    };

    recognition.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error);
      alert("Error en reconocimiento de voz: " + event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startRecognition = () => {
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      window.speechSynthesis.speak(utterance);
    }
  };

  const ejecutarComando = (texto) => {
    const normalized = texto.toLowerCase();
    console.log("Ejecutando comando para texto:", normalized);

    if (
      normalized.includes("subir imagen") ||
      normalized.includes("seleccionar imagen")
    ) {
      speak("Abriendo selector de imagen");
      const boton = document.getElementById("btn-subir");
      if (boton) boton.click();
    } else if (normalized.includes("usar cámara")) {
      speak("Activando cámara");
      const boton = document.getElementById("btn-camara");
      if (boton) boton.click();
    } else if (normalized.includes("clasificar")) {
      speak("Iniciando clasificación de imagen");
      const boton = document.getElementById("btn-clasificar");
      if (boton) boton.click();
    } else if (
      normalized.includes("tomar foto") ||
      normalized.includes("sacar foto") ||
      normalized.includes("hacer foto")
    ) {
      speak("Capturando foto");
      const boton = document.getElementById("btn-foto");
      if (boton) boton.click();
    } else if (
      normalized.includes("detener cámara") ||
      normalized.includes("parar cámara") ||
      normalized.includes("apagar cámara")
    ) {
      speak("Deteniendo cámara");
      const boton = document.getElementById("btn-detener");
      if (boton) boton.click();
    } else if (
      normalized.includes("limpiar") ||
      normalized.includes("borrar")
    ) {
      speak("Limpiando selección");
      const boton = document.getElementById("btn-limpiar");
      if (boton) boton.click();
    }
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Reconocimiento de Voz</h2>
      <button onClick={startRecognition} style={styles.button} className="btn-voice">
        <FaMicrophone /> Habla ahora
      </button>
      <p>
        <strong>Texto reconocido:</strong>
      </p>
      <p style={styles.transcript}>{transcript}</p>
    </section>
  );
}

const styles = {
  container: {
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 12,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 700,
    width: "90%",
    margin: "30px auto",
    backgroundColor: "#fefefe",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: 10,
    color: "#333",
    fontSize: "1.3rem",
  },
  button: {
    padding: "10px 18px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontSize: "1rem",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    transition: "background-color 0.3s ease",
  },
  transcript: {
    color: "green",
    fontWeight: "600",
    marginTop: 12,
    fontSize: "1rem",
    minHeight: 24,
  },
};
