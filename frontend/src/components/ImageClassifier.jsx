import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaSpinner, FaCamera, FaTimes } from "react-icons/fa";

export default function ImageClassifier() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Para la cámara
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState("");

  // Manejar archivo subido
  const handleFileChange = (e) => {
    setError("");
    setCameraError("");
    setPrediction("");
    setConfidence(0);

    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCameraOn(false);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // Encender cámara
  const startCamera = () => {
    setError("");
    setCameraError("");
    setPrediction("");
    setConfidence(0);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCameraOn(true);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        setCameraError("No se pudo acceder a la cámara: " + err.message);
        setCameraOn(false);
      });
  };

  // Apagar cámara y limpiar stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  // Capturar foto desde cámara
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    if (width && height) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(blob));
          stopCamera();
        }
      }, "image/jpeg");
    }
  };

  // Enviar archivo al backend
  const handleClassify = async () => {
    if (!selectedFile) {
      setError("Por favor, selecciona una imagen o toma una foto primero.");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction("");
    setConfidence(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const resPredict = await fetch("http://localhost:5000/predict_mobilenet", {
        method: "POST",
        body: formData,
      });

      if (!resPredict.ok) {
        throw new Error("Error al clasificar la imagen.");
      }

      const dataPredict = await resPredict.json();
      setPrediction(dataPredict.predicted_class);
      setConfidence(dataPredict.confidence);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar imagen seleccionada
  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction("");
    setConfidence(0);
    setError("");
    setCameraError("");
  };

  // Limpiar al desmontar (por si se cierra cámara)
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Clasificador de Imágenes</h1>

      <div style={styles.buttonsRow}>
        <label
          htmlFor="fileInput"
          style={styles.fileInputLabel}
          className="file-input-label"
          id="btn-subir"
        >
          Seleccionar Imagen
        </label>
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={loading}
        />
        <button
          onClick={startCamera}
          disabled={loading}
          style={styles.button}
          className="btn-camera"
          title="Abrir cámara"
          id="btn-camara"
        >
          <FaCamera /> Usar Cámara
        </button>
        <button
          onClick={clearSelection}
          disabled={loading || (!selectedFile && !previewUrl)}
          style={styles.button}
          title="Limpiar selección"
          id="btn-limpiar"
        >
          <FaTimes /> Limpiar
        </button>
      </div>

      {cameraOn && (
        <div style={styles.cameraContainer}>
          <video ref={videoRef} style={styles.video} />
          <button
            onClick={capturePhoto}
            style={styles.button}
            className="btn-capture"
            id="btn-foto"
          >
            Tomar Foto
          </button>
          <button
            onClick={stopCamera}
            style={styles.button}
            className="btn-stop-camera"
            id="btn-detener"
          >
            Detener Cámara
          </button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}

      {cameraError && <p style={styles.cameraError}>{cameraError}</p>}

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          style={styles.previewImage}
          onLoad={() => URL.revokeObjectURL(previewUrl)}
        />
      )}

      <button
        onClick={handleClassify}
        disabled={loading}
        style={loading ? styles.buttonDisabled : styles.button}
        className="btn-classify"
        id="btn-clasificar"
      >
        {loading ? (
          <>
            <FaSpinner className="spin" /> Clasificando...
          </>
        ) : (
          <>
            <FaSearch /> Clasificar Imagen
          </>
        )}
      </button>

      {error && <p style={styles.errorText}>{error}</p>}

      {prediction && (
        <div style={styles.resultBox}>
          <p style={styles.resultText}>
            <strong>Predicción:</strong> {prediction}
          </p>
          <p style={styles.resultText}>
            <strong>Confianza:</strong> {confidence.toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "700px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    color: "#333",
  },
  buttonsRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.8rem 1.2rem",
    marginBottom: "1.5rem",
  },

  fileInputLabel: {
    display: "inline-block",
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.6rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.6rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "0.5rem",
    minHeight: "45px",
  },
  buttonDisabled: {
    backgroundColor: "#9fc4f7",
    color: "white",
    padding: "0.6rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
    cursor: "not-allowed",
    minHeight: "45px",
  },
  cameraContainer: {
    marginBottom: "1rem",
  },
  video: {
    width: "100%",
    maxHeight: "400px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  previewImage: {
    maxWidth: "100%",
    height: "auto",
    maxHeight: "350px",
    objectFit: "contain",
    margin: "1rem auto",
    display: "block",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  errorText: {
    color: "#b00020",
    marginTop: "1rem",
  },
  cameraError: {
    color: "#b00020",
    marginTop: "0.5rem",
    fontWeight: "bold",
  },
  resultBox: {
    marginTop: "1.5rem",
    padding: "1rem",
    border: "1px solid #007bff",
    borderRadius: "10px",
    backgroundColor: "#eaf3ff",
  },
  resultText: {
    margin: "0.4rem 0",
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#003366",
  },
};
