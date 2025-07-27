import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image

def classify_image(img_path, model):
    img = Image.open(img_path).convert("L").resize((28, 28))
    img_arr = np.array(img).reshape(1, 28, 28) / 255.0
    prediction = model.predict(img_arr)
    return np.argmax(prediction)
