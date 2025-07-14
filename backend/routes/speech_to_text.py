from flask import Blueprint, request, jsonify
import wave
import json
from vosk import KaldiRecognizer
from services.audio_preprocessor import preprocess_audio
from models import vosk_model

speech_to_text_bp = Blueprint('speech_to_text', __name__, url_prefix='/speech-to-text')

@speech_to_text_bp.route('', methods=['POST'])
def speech_to_text():
    try:
        print('Debut speech_to_text')
        if 'audio' not in request.files:
            return jsonify({'error': 'Fichier audio manquant'}), 400

        audio_file = request.files['audio']
        processed_audio = preprocess_audio(audio_file)

        with wave.open(processed_audio, "rb") as wf:
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

        texte_complet = " ".join(results).strip()
        print(f'[SpeechToText] Texte reconnu : {texte_complet}')
        return jsonify({'text': texte_complet})

    except Exception as e:
        return jsonify({'error': str(e)}), 500