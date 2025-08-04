from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import pyttsx3
from model_utils import create_model, load_data
import matplotlib.pyplot as plt
import io
import base64

from image_classifier_efficientnet import classify_image_mobilenet
from googletrans import Translator

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

translator = Translator()
engine = pyttsx3.init()

@app.route('/')
def index():
    return jsonify({"message": "API backend funcionando. Usa /predict_mobilenet"})

@app.route('/predict_mobilenet', methods=['POST'])
def predict_mobilenet():
    if 'file' not in request.files:
        return jsonify({'error': 'No se subió ninguna imagen'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No se seleccionó ningún archivo'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        label_es, confidence = classify_image_mobilenet(filepath)  # etiqueta en español o fallback inglés
        print(f"[Backend] Etiqueta traducida enviada al frontend: {label_es}")
    except Exception as e:
        return jsonify({'error': f'Error al clasificar la imagen: {str(e)}'}), 500

    return jsonify({
        'predicted_class': label_es,
        'confidence': round(confidence * 100, 2),
        'filename': filename
    })

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No se recibió texto para traducir"}), 400
    
    try:
        translated = translator.translate(text, src='en', dest='es')
        return jsonify({"translated_text": translated.text})
    except Exception as e:
        return jsonify({"translated_text": text, "error": f"Error en la traducción: {str(e)}"})

@app.route('/speak', methods=['POST'])
def speak():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No se recibió texto para convertir a voz"}), 400

    filename = "tts_output.mp3"
    try:
        engine.save_to_file(text, filename)
        engine.runAndWait()
        return send_file(filename, as_attachment=True)
    except Exception as e:
        return jsonify({"error": f"Error al generar audio: {str(e)}"}), 500

@app.route('/recognize_voice', methods=['POST'])
def recognize_voice():
    audio_file = request.files.get('audio')
    if not audio_file:
        return jsonify({'error': 'No se envió audio'}), 400
    
    simulated_text = "Hola, esto es una prueba de reconocimiento de voz"
    return jsonify({"transcription": simulated_text})

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/train_model', methods=['POST'])
def train_model_route():
    data = request.get_json()
    epochs = int(data.get('epochs', 5))
    batch_size = int(data.get('batch_size', 32))

    (x_train, y_train), (x_test, y_test) = load_data()
    model = create_model()

    history = model.fit(x_train, y_train,
                        epochs=epochs,
                        batch_size=batch_size,
                        validation_data=(x_test, y_test),
                        verbose=0)

    # Graficar precisión
    plt.figure()
    plt.plot(history.history['accuracy'], label='Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.title('Precisión durante entrenamiento')
    plt.xlabel('Épocas')
    plt.ylabel('Precisión')
    plt.legend()

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    return jsonify({
        'accuracy': history.history['accuracy'],
        'val_accuracy': history.history['val_accuracy'],
        'loss': history.history['loss'],
        'val_loss': history.history['val_loss'],
        'plot_img': img_base64
    })