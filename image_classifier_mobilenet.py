import numpy as np
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, decode_predictions, preprocess_input
from tensorflow.keras.preprocessing import image
from googletrans import Translator

model = MobileNetV2(weights='imagenet')
translator = Translator()

label_map = {
    "banana": "plátano",
    "golden_retriever": "perro golden retriever",
    "cat": "gato",
    "dog": "perro",
    "pencil": "lápiz",
    "cellular_telephone": "teléfono celular",
    "laptop": "portátil",
    "coffee": "café",
    "person": "persona"
}

def classify_image_mobilenet(img_path):
    img = Image.open(img_path).convert("RGB").resize((224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    preds = model.predict(x)
    decoded = decode_predictions(preds, top=1)[0][0]  # (id, label, prob)
    label_en = decoded[1]
    confidence = decoded[2]

    if label_en in label_map:
        label_es = label_map[label_en]
    else:
        try:
            label_es = translator.translate(label_en, src='en', dest='es').text
        except:
            label_es = label_en

    return label_es, confidence
