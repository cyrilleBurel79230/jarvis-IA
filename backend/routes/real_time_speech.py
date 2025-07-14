from flask import Blueprint, jsonify
import pyaudio
import json
from vosk import KaldiRecognizer
from models import vosk_model

real_time_speech_bp = Blueprint('real_time_speech', __name__, url_prefix='/real-time-speech-to-text')

@real_time_speech_bp.route('', methods=['POST'])
def real_time_speech_to_text():
    print('Début real_time_speech')
    try:
        p = pyaudio.PyAudio()
        stream = p.open(format=pyaudio.paInt16,
                        channels=1,
                        rate=16000,
                        input=True,
                        frames_per_buffer=8000)
        stream.start_stream()

        rec = KaldiRecognizer(vosk_model, 16000)
        rec.SetWords(True)

        text = ""
        for _ in range(30):  # 10 secondes environ
            data = stream.read(4000, exception_on_overflow=False)
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                text += result.get("text", "") + " "

        final_result = json.loads(rec.FinalResult())
        text += final_result.get("text", "")

        stream.stop_stream()
        stream.close()
        p.terminate()
        print('Fin real_time_speech')
        return jsonify({'text': text.strip()})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
