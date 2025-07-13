import os
import wave
from vosk import Model, KaldiRecognizer
from pydub import AudioSegment
import io
import sounddevice as sd

# Chemin vers le modèle Vosk
model_path = "C:/Users/cyril/OneDrive/Documents/Projet_assistants_IA/jarvis-IA/backend/vosk-model-fr-0.22"  # Remplacez par le chemin absolu vers votre modèle Vosk

# Vérifier si le modèle existe
if not os.path.exists(model_path):
    raise RuntimeError(f"Le modèle Vosk n'existe pas à l'emplacement spécifié: {model_path}")

# Charger le modèle Vosk
model = Model(model_path)

def preprocess_audio(audio_file):
    try:
        # Charger l'audio avec pydub
        audio = AudioSegment.from_file(audio_file)

        # Convertir l'audio en mono, 16 bits, 16000 Hz
        audio = audio.set_channels(1).set_frame_rate(16000).set_sample_width(2)

        # Exporter l'audio traité en format WAV
        buffer = io.BytesIO()
        audio.export(buffer, format="wav")
        buffer.seek(0)
        return buffer
    except Exception as e:
        print(f"Error in preprocess_audio: {str(e)}")
        raise

def recognize_speech(audio_file):
    try:
        # Pré-traiter l'audio
        processed_audio = preprocess_audio(audio_file)

        # Utiliser Vosk pour la reconnaissance vocale
        wf = wave.open(processed_audio, "rb")
        if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
            raise ValueError("Le fichier audio doit être mono, 16 bits, et avoir un taux d'échantillonnage de 16000 Hz")

        rec = KaldiRecognizer(model, wf.getframerate())
        rec.SetWords(True)

        text = ""
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                result = rec.Result()
                text += result['text']

        final_result = rec.FinalResult()
        text += final_result['text']

        print(f"Recognized text: {text}")
    except Exception as e:
        print(f"Error in recognize_speech: {str(e)}")

# Chemin vers le fichier audio à tester
audio_file_path = "C:/Users/cyril/OneDrive/Documents/Projet_assistants_IA/jarvis-IA/backend/test_audio.wav"  # Remplacez par le chemin vers votre fichier audio

# Tester la reconnaissance vocale
recognize_speech(audio_file_path)