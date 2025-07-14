from pydub import AudioSegment
import io

def preprocess_audio(audio_file):
    """
    Convertit un fichier audio (mp3/wav/webm...) en mono 16-bit 16kHz WAV.
    Renvoie un buffer BytesIO utilisable avec wave.open().
    
    """
    try:
        audio = AudioSegment.from_file(audio_file)
        audio = audio.set_channels(1).set_frame_rate(16000).set_sample_width(2)
        buffer = io.BytesIO()
        audio.export(buffer, format="wav")
        buffer.seek(0)
        return buffer
    except Exception as e:
        raise RuntimeError(f"Erreur dans preprocess_audio: {str(e)}")