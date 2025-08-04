import React, { useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

export default function TextToSpeech() {
  const [text, setText] = useState("");

  const handleSpeak = () => {
    if (text.trim() === "") return;

    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Texto a Voz</h2>
      <input
        type="text"
        value={text}
        placeholder="Escribe algo..."
        onChange={(e) => setText(e.target.value)}
        style={styles.input}
      />
      <br />
      <button onClick={handleSpeak} style={styles.button} className="btn-tts">
        <FaVolumeUp /> Leer en voz alta
      </button>
    </section>
  );
}

const styles = {
  container: {
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 12,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 700,          // Más ancho
    width: "90%",           // Responsive en pantallas pequeñas
    margin: "30px auto",    // Centrado
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
  input: {
  width: "80%",             // Más ancho
  padding: "10px 14px",
  fontSize: "1.1rem",
  border: "1px solid #ccc",
  borderRadius: 6,
  marginBottom: 10,
  boxSizing: "border-box",
}

};
