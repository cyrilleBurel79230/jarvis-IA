import pyttsx3
import numpy as np
import wave
engine = pyttsx3.init()
engine.save_to_file("Jarvis activé.", "sounds/boot_beep.wav")
engine.runAndWait()


def beep_wav(filename, freq=440, duration=0.2):
    rate = 44100
    t = np.linspace(0, duration, int(rate * duration))
    signal = (np.sin(2 * np.pi * freq * t) * 32767).astype(np.int16)

    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(rate)
        f.writeframes(signal.tobytes())

beep_wav("sounds/beep.wav")  # effet sonore Jarvis
