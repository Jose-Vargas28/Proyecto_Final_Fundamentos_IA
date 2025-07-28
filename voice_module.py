import speech_recognition as sr
import pyttsx3

def speech_to_text():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Habla ahora...")
        audio = recognizer.listen(source)
        try:
            return recognizer.recognize_google(audio, language="es-ES")
        except sr.UnknownValueError:
            return "No se entendió"
        except sr.RequestError:
            return "Error con el servicio"

def text_to_speech(text):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

