import numpy as np
from PIL import Image
from tensorflow.keras.applications.efficientnet import EfficientNetB3, decode_predictions, preprocess_input
from tensorflow.keras.preprocessing import image
from googletrans import Translator

# Carga del modelo EfficientNetB3 con pesos ImageNet
model = EfficientNetB3(weights='imagenet')

# Instancia del traductor
translator = Translator()

# Diccionario local con traducciones conocidas
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
    try:
        img = Image.open(img_path).convert("RGB").resize((300, 300))  # EfficientNetB3 espera 300x300
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)

        preds = model.predict(x)
        decoded = decode_predictions(preds, top=1)[0][0]  # (id, label, prob)

        label_en = decoded[1]
        confidence = float(decoded[2])

        # Primero intentar con diccionario local
        if label_en in label_map:
            label_es = label_map[label_en]
            print(f"[Backend] Traducción local para '{label_en}': '{label_es}'")
        else:
            # Si no está en diccionario, intentar traducción online con validación
            try:
                result = translator.translate(label_en, src='en', dest='es')
                if result is not None and hasattr(result, 'text') and result.text is not None:
                    label_es = result.text
                    print(f"[Backend] Traducción online para '{label_en}': '{label_es}'")
                else:
                    print(f"[Backend] Traducción online falló: resultado inesperado {result}")
                    label_es = label_en
            except Exception as e:
                print(f"[Backend] Error en traducción online: {e}")
                label_es = label_en  # fallback a inglés si falla la traducción

        return label_es, confidence

    except Exception as e:
        print("Error en clasificación:", e)
        return "desconocido", 0.0
