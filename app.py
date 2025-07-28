import tkinter as tk
from tkinter import filedialog, messagebox
from image_classifier_mnist import classify_image_mnist
from image_classifier_mobilenet import classify_image_mobilenet
from model_utils import load_data, create_model, train_model, plot_metrics
from voice_module import speech_to_text, text_to_speech

model_mnist = None

def center_window(win, width=450, height=400):
    screen_width = win.winfo_screenwidth()
    screen_height = win.winfo_screenheight()
    x = (screen_width // 2) - (width // 2)
    y = (screen_height // 2) - (height // 2)
    win.geometry(f"{width}x{height}+{x}+{y}")

def train():
    global model_mnist
    (x_train, y_train), (x_test, y_test) = load_data()
    model_mnist = create_model()
    model_mnist, history = train_model(model_mnist, x_train, y_train, x_test, y_test)
    model_mnist.save("mnist_model.h5")
    plot_metrics(history)
    messagebox.showinfo("Entrenamiento", "Modelo MNIST entrenado y guardado")

def classify_mnist():
    if model_mnist is None:
        messagebox.showerror("Error", "Entrena el modelo MNIST primero")
        return
    file_path = filedialog.askopenfilename()
    if file_path:
        label = classify_image_mnist(file_path, model_mnist)
        messagebox.showinfo("Clasificación MNIST", f"Dígito clasificado: {label}")

def classify_mobilenet():
    file_path = filedialog.askopenfilename()
    if file_path:
        label = classify_image_mobilenet(file_path)
        messagebox.showinfo("Clasificación MobileNetV2", f"Imagen clasificada como: {label}")

def speech_to_text_gui():
    result = speech_to_text()
    messagebox.showinfo("Reconocimiento de Voz", f"Dijiste: {result}")

def text_to_speech_gui():
    text = entry_text.get()
    if text:
        text_to_speech(text)
    else:
        messagebox.showerror("Error", "Escribe algo primero")

app = tk.Tk()
app.title("Proyecto IA - Clasificador y Voz")
center_window(app)
app.resizable(False, False)

frame = tk.Frame(app, padx=20, pady=20)
frame.pack(expand=True, fill='both')

# Configura la columna 0 para que expanda y permita centrar
frame.grid_columnconfigure(0, weight=1)

btn_style = {
    'font': ('Arial', 12, 'bold'),
    'width': 30,
    'padx': 5,
    'pady': 8,
    'bd': 2,
    'relief': 'raised',
}

btn_train = tk.Button(frame, text="Entrenar Modelo MNIST", bg="#4CAF50", fg="white", command=train, **btn_style)
btn_train.grid(row=0, column=0, pady=5, sticky='ew')

btn_classify_mnist = tk.Button(frame, text="Clasificar Imagen MNIST", bg="#2196F3", fg="white", command=classify_mnist, **btn_style)
btn_classify_mnist.grid(row=1, column=0, pady=5, sticky='ew')

btn_classify_mobilenet = tk.Button(frame, text="Clasificar Imagen General (MobileNetV2)", bg="#9C27B0", fg="white", command=classify_mobilenet, **btn_style)
btn_classify_mobilenet.grid(row=2, column=0, pady=5, sticky='ew')

btn_speech_to_text = tk.Button(frame, text="Hablar (voz a texto)", bg="#FF9800", fg="white", command=speech_to_text_gui, **btn_style)
btn_speech_to_text.grid(row=3, column=0, pady=5, sticky='ew')

entry_text = tk.Entry(frame, font=('Arial', 12))
entry_text.grid(row=4, column=0, pady=10, ipadx=40, ipady=5, sticky='ew')

btn_text_to_speech = tk.Button(frame, text="Leer Texto (texto a voz)", bg="#F44336", fg="white", command=text_to_speech_gui, **btn_style)
btn_text_to_speech.grid(row=5, column=0, pady=5, sticky='ew')

app.mainloop()
