from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
from gtts import gTTS
import os
from pydub import AudioSegment
import io
from transformers import pipeline
from huggingface_hub import login

app = Flask(__name__)
CORS(app)

# Connectez-vous avec votre token
login(token="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")

def preprocess_audio(audio_file):
    # Charger l'audio avec pydub
    audio = AudioSegment.from_file(audio_file)

    # Réduire le bruit (vous pouvez ajuster les paramètres selon vos besoins)
    audio = audio.low_pass_filter(3000)  # Filtre passe-bas
    audio = audio.high_pass_filter(200)  # Filtre passe-haut

    # Exporter l'audio traité en format WAV
    buffer = io.BytesIO()
    audio.export(buffer, format="wav")
    buffer.seek(0)
    return buffer

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

        recognizer = sr.Recognizer()
        with sr.AudioFile(processed_audio) as source:
            print("Reading audio file")
            audio_data = recognizer.record(source)
            print("Recognizing speech")
            try:
                text = recognizer.recognize_google(audio_data)
                print(f"Recognized text: {text}")
            except sr.UnknownValueError:
                print("Google Speech Recognition could not understand the audio")
                return jsonify({'error': 'Google Speech Recognition could not understand the audio'}), 500
            except sr.RequestError as e:
                print(f"Could not request results from Google Speech Recognition service; {e}")
                return jsonify({'error': f'Could not request results from Google Speech Recognition service; {e}'}), 500

        return jsonify({'text': text})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        print("Received request for /text-to-speech")
        data = request.json
        if 'text' not in data:
            print("No text provided")
            return jsonify({'error': 'No text provided'}), 400

        text = data['text']
        print(f"Received text: {text}")
        tts = gTTS(text=text, lang='fr')
        tts.save("static/output.mp3")
        print("Saved audio file as output.mp3")
        return jsonify({'audio_url': '/static/output.mp3'})
    except Exception as e:
        print(f"Error: {str(e)}")
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

        # Utilisez un modèle public alternatif
        nlp = pipeline("text-generation", model="distilgpt2")
        result = nlp(prompt, max_length=50, num_return_sequences=1)

        generated_text = result[0]['generated_text']
        print(f"Generated text: {generated_text}")

        return jsonify({'generated_text': generated_text})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)