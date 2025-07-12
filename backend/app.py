from flask import Flask, request, jsonify
from flask_cors import CORS
from vosk import Model, KaldiRecognizer
import pyaudio
import wave
import os
import io
from pydub import AudioSegment
from transformers import pipeline
from huggingface_hub import login

app = Flask(__name__)
CORS(app)

# Connectez-vous avec votre token
login(token="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")
model_path = "C:/Users/cyril/OneDrive/Documents/Projet_assistants_IA/jarvis-IA/backend/vosk-model-fr-0.22"  # Remplacez par le chemin absolu vers votre modèle Vosk
# Charger le modèle Vosk

if not os.path.exists(model_path):
    raise RuntimeError(f"Le modèle Vosk n'existe pas à l'emplacement spécifié: {model_path}")

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

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    try:
        print("Received request for /speech-to-text")
        if 'audio' not in request.files:
            print("No audio file provided")
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        print(f"Received audio file: {audio_file.filename}")

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
        return jsonify({'text': text})
    except Exception as e:
        print(f"Error in speech_to_text: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/real-time-speech-to-text', methods=['POST'])
def real_time_speech_to_text():
    try:
        print("Received request for /real-time-speech-to-text")

        # Initialiser PyAudio
        p = pyaudio.PyAudio()
        stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8000)
        stream.start_stream()

        rec = KaldiRecognizer(model, 16000)
        rec.SetWords(True)

        text = ""
        while True:
            data = stream.read(4000)
            if rec.AcceptWaveform(data):
                result = rec.Result()
                text += result['text']

        final_result = rec.FinalResult()
        text += final_result['text']

        print(f"Recognized text: {text}")
        return jsonify({'text': text})
    except Exception as e:
        print(f"Error in real_time_speech_to_text: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/generate-text', methods=['POST'])
def generate_text():
    try:
        print("Received request for /generate-text")
        data = request.json
        if 'prompt' not in data:
            print("No prompt provided")
            return jsonify({'error': 'No prompt provided'}), 400

        prompt = data['prompt']
        print(f"Received prompt: {prompt}")

        # Utilisez le modèle Mistral pour la génération de texte
        nlp = pipeline("text-generation", model="mistralai/Mistral-7B-v0.1")
        result = nlp(prompt, max_length=50, num_return_sequences=1)

        generated_text = result[0]['generated_text']
        print(f"Generated text: {generated_text}")

        return jsonify({'generated_text': generated_text})
    except Exception as e:
        print(f"Error in generate_text: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return "Welcome to the Jarvis AI Assistant API!"

if __name__ == '__main__':
    app.run(debug=True)