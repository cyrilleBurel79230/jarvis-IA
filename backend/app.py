from flask import Flask
from flask_cors import CORS
from routes import speech_to_text_bp, real_time_speech_bp, generate_text_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(speech_to_text_bp)
app.register_blueprint(real_time_speech_bp)
app.register_blueprint(generate_text_bp)

@app.route('/')
def home():
    return "Bienvenue sur Jarvis IA"

if __name__ == '__main__':
    app.run(debug=True)


















"""


from flask import Flask, request, jsonify
from flask_cors import CORS
from vosk import Model, KaldiRecognizer
import pyaudio
import wave
import os
import io
import json
from pydub import AudioSegment
from transformers import pipeline
from huggingface_hub import login
import logging
from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

# Connectez-vous avec votre token

# Token HuggingFace depuis variable d’environnement
HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise EnvironmentError("❌ Variable d’environnement HF_TOKEN manquante")
login(token=HF_TOKEN)

# Modèle HuggingFace (chargé une seule fois)
logging.info("Chargement du modèle Hugging Face...")
text_gen_pipeline = pipeline("text-generation", model="mistralai/Mistral-7B-v0.1")
logging.info("Modèle Hugging Face prêt.")

# Charger le modèle Vosk
model_path = "C:/Users/cyril/OneDrive/Documents/Projet_assistants_IA/jarvis-IA/backend/vosk-model-small-fr-0.22"  # Remplacez par le chemin absolu vers votre modèle Vosk



if not os.path.exists(model_path):
    raise RuntimeError(f"Le modèle Vosk n'existe pas à l'emplacement spécifié: {model_path}")

model = Model(model_path)

logging.info("Received request for /generate-text")

# --------------------------------
# UTILITAIRE : Prétraitement audio
# --------------------------------

def preprocess_audio(audio_file):
    try:
        audio = AudioSegment.from_file(audio_file)
        audio = audio.set_channels(1).set_frame_rate(16000).set_sample_width(2)
        buffer = io.BytesIO()
        audio.export(buffer, format="wav")
        buffer.seek(0)
        return buffer
    except Exception as e:
        logging.error(f"Error in preprocess_audio: {str(e)}")
        raise

# --------------------------------
# ENDPOINTS
# --------------------------------

@app.route('/')
def home():
    return "👋 Bienvenue sur l'API Jarvis IA Assistant !"

# === SPEECH TO TEXT ===
@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    try:
        logging.info("🎤 Requête reçue sur /speech-to-text")

        if 'audio' not in request.files:
            return jsonify({'error': 'Fichier audio manquant'}), 400

        audio_file = request.files['audio']
        processed_audio = preprocess_audio(audio_file)

        wf = wave.open(processed_audio, "rb")
        if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
            raise ValueError("Fichier audio invalide : mono, 16 bits, 16000 Hz requis.")

        rec = KaldiRecognizer(vosk_model, wf.getframerate())
        rec.SetWords(True)

        results = []
        while True:
            data = wf.readframes(4000)
            if not data:
                break
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                results.append(result.get("text", ""))

        final_result = json.loads(rec.FinalResult())
        results.append(final_result.get("text", ""))

        full_text = " ".join(results).strip()
        logging.info(f"📝 Texte reconnu : {full_text}")

        return jsonify({'text': full_text})

    except Exception as e:
        logging.error(f"❌ Erreur dans /speech-to-text : {str(e)}")
        return jsonify({'error': str(e)}), 500

# === REAL-TIME (LOCAL ONLY) ===
@app.route('/real-time-speech-to-text', methods=['POST'])
def real_time_speech_to_text():
    try:
        logging.info("🎙 Requête reçue sur /real-time-speech-to-text")

        p = pyaudio.PyAudio()
        stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000,
                        input=True, frames_per_buffer=8000)
        stream.start_stream()

        rec = KaldiRecognizer(vosk_model, 16000)
        rec.SetWords(True)

        text = ""
        max_iterations = 30
        for _ in range(max_iterations):
            data = stream.read(4000, exception_on_overflow=False)
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                text += result.get("text", "") + " "

        final_result = json.loads(rec.FinalResult())
        text += final_result.get("text", "")

        stream.stop_stream()
        stream.close()
        p.terminate()

        return jsonify({'text': text.strip()})

    except Exception as e:
        logging.error(f"❌ Erreur dans /real-time-speech-to-text : {str(e)}")
        return jsonify({'error': str(e)}), 500

# === TEXT GENERATION ===
@app.route('/generate-text', methods=['POST'])
def generate_text():
    try:
        logging.info("✍️ Requête reçue sur /generate-text")

        data = request.json
        if not data or 'prompt' not in data:
            return jsonify({'error': 'Champ prompt requis'}), 400

        prompt = data['prompt']
        logging.info(f"🔎 Prompt reçu : {prompt}")

        result = text_gen_pipeline(prompt, max_length=100, num_return_sequences=1, do_sample=True)
        generated_text = result[0].get('generated_text', '').strip()

        logging.info(f"📄 Texte généré : {generated_text}")
        return jsonify({'generated_text': generated_text})

    except Exception as e:
        logging.error(f"❌ Erreur dans /generate-text : {str(e)}")
        return jsonify({'error': str(e)}), 500

# --------------------------------
# LANCEMENT DU SERVEUR
# --------------------------------

if __name__ == '__main__':
    app.run(debug=True)

    """