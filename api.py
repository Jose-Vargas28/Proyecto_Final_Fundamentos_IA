from flask import Flask, request, jsonify
from image_classifier_mobilenet import classify_image
from tensorflow.keras.applications import MobileNetV2

app = Flask(__name__)
model = MobileNetV2(weights='imagenet')

@app.route('/')
def home():
    return "API de clasificación con MobileNetV2 funcionando. Usa /predict con POST (imagen)."

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nombre de archivo vacío'}), 400

    try:
        file_path = 'temp.jpg'
        file.save(file_path)

        label, confidence = classify_image(file_path, model)

        return jsonify({
            'prediction': label,
            'confidence': f"{confidence:.2f}%"
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
