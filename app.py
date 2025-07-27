import tkinter as tk
from tkinter import filedialog, messagebox
from model_utils import load_data, create_model, train_model, plot_metrics
from image_classifier import classify_image
from voice_module import speech_to_text, text_to_speech
import os

model = None  # El modelo se guarda aquí una vez entrenado

def train():
    global model
    try:
        (x_train, y_train), (x_test, y_test) = load_data()
        model = create_model()
        model, history = train_model(model, x_train, y_train, x_test, y_test)
        model.save("mnist_model.h5")
        plot_metrics(history)
        messagebox.showinfo("Entrenamiento", "Modelo entrenado y guardado")
    except Exception as e:
        messagebox.showerror("Error en entrenamiento", str(e))

def classify():
    global model
    try:
        if model is None:
            if os.path.exists("mnist_model.h5"):
                from tensorflow.keras.models import load_model
                model = load_model("mnist_model.h5")
            else:
                messagebox.showerror("Error", "Entrena el modelo primero")
                return

        file_path = filedialog.askopenfilename(filetypes=[("Imagenes", "*.png *.jpg *.jpeg")])
        if file_path:
            label = classify_image(file_path, model)
            messagebox.showinfo("Clasificación", f"Imagen clasificada como: {label}")
    except Exception as e:
        messagebox.showerror("Error en clasificación", str(e))

def speech_to_text_gui():
    try:
        result = speech_to_text()
        messagebox.showinfo("Reconocimiento de Voz", f"Dijiste: {result}")
    except Exception as e:
        messagebox.showerror("Error en voz a texto", str(e))

def text_to_speech_gui():
    text = entry.get()
    if text.strip():
        try:
            text_to_speech(text)
        except Exception as e:
            messagebox.showerror("Error en texto a voz", str(e))
    else:
        messagebox.showerror("Error", "Escribe algo primero")

# Interfaz gráfica
app = tk.Tk()
app.title("Proyecto IA - Clasificador y Voz")
app.geometry("300x300")

tk.Button(app, text="Entrenar Modelo", command=train).pack(pady=5)
tk.Button(app, text="Clasificar Imagen", command=classify).pack(pady=5)
tk.Button(app, text="Hablar (voz a texto)", command=speech_to_text_gui).pack(pady=5)

entry = tk.Entry(app)
entry.pack(pady=5)

tk.Button(app, text="Leer Texto (texto a voz)", command=text_to_speech_gui).pack(pady=5)

app.mainloop()
