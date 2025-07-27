from flask import Flask, request, jsonify
from image_classifier import classify_image
from tensorflow.keras.models import load_model  # ✅ Línea corregida

app = Flask(__name__)
model = load_model("mnist_model.h5")

@app.route('/predict', methods=['POST'])
def predict():
    img_path = request.json.get('img_path')  # ✅ Más seguro con .get()
    if not img_path:
        return jsonify({'error': 'img_path not provided'}), 400

    try:
        label = classify_image(img_path, model)
        return jsonify({'prediction': int(label)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
