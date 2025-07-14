import wave
import json
from vosk import KaldiRecognizer
from models import vosk_model

def recognize_speech(processed_audio_buffer):
    """
    Prend un buffer audio WAV (mono, 16kHz) et renvoie le texte reconnu.
    """
    try:
        wf = wave.open(processed_audio_buffer, "rb")
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

        return " ".join(results).strip()

    except Exception as e:
        raise RuntimeError(f"Erreur dans recognize_speech: {str(e)}")
