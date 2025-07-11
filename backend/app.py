from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
from gtts import gTTS
import os

app = Flask(__name__)
CORS(app)

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    audio_file = request.files['audio']
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data)
    return jsonify({'text': text})

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    data = request.json
    text = data['text']
    tts = gTTS(text=text, lang='fr')
    tts.save("output.mp3")
    return jsonify({'audio_url': '/static/output.mp3'})

if __name__ == '__main__':
    app.run(debug=True)