from elevenlabs.client import ElevenLabs
from elevenlabs import play
from dotenv import load_dotenv
import os
import re
from threading import Thread
from playsound import playsound
import time


# Chargement de la clé API ElevenLabs
load_dotenv()
client = ElevenLabs(api_key=os.getenv("ELEVENTLABS_API_KEY"))

# 📎 ID de la voix Jarvis (ex: voix française)
VOICE_ID = "IKne3meq5aSn9XLyUdCD"  # Remplace avec celle que tu veux
MODEL_ID = "eleven_multilingual_v2"


def clean_response(text: str) -> str:
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)     # lien markdown
    text = re.sub(r'(\*\*|__)(.*?)\1', r'\2', text)           # gras
    text = re.sub(r'(\*|_)(.*?)\1', r'\2', text)              # italique
    text = re.sub(r'[\*#•\-]', '', text)                      # symboles
    text = re.sub(r'[^\w\s.,!?\'"]+', '', text)               # emojis et autres
    text = re.sub(r'\s{2,}', ' ', text)
    return text.strip()

def animation_jarvis():
    for symbole in ["[🔷]", "[🔶]", "[🔷]", "[🔶]"]:
        print(symbole, end="\r")
        time.sleep(0.3)


# 🔊 Lecture d'une phrase
def jouer_phrase(phrase):
    #playsound("sounds/beep.wav")  # son d’activation avant la voix
    animation_jarvis()                    # 💠 animation terminal

    audio = client.text_to_speech.convert(
        voice_id=VOICE_ID,
        text=phrase,
        model_id=MODEL_ID
    )
    play(audio)




# 🤖 Fonction principale
# 🧠 Lecture adaptative

def parler_en_jarvis(texte: str):
    texte_nettoye = clean_response(texte)

    # 🧠 Si le texte est long, découpe en phrases
    if len(texte_nettoye) > 250:
        phrases = re.split(r'[.!?]', texte_nettoye)
        for phrase in phrases:
            phrase = phrase.strip()
            if len(phrase) > 2:
                jouer_phrase(phrase)
    else:
        jouer_phrase(texte_nettoye)
        

"""

   voices = client.voices.get_all()
    for v in voices.voices:
        print(f"{v.name} → {v.voice_id}")

Aria → 9BWtsMINqrJLrRacOk9x
Sarah → EXAVITQu4vr4xnSDxMaL
Laura → FGY2WhTYpPnrIDTdsKH5
Charlie → IKne3meq5aSn9XLyUdCD
George → JBFqnCBsd6RMkjVDRZzb
Callum → N2lVS1w4EtoT3dr4eOWO
River → SAz9YHcvj6GT2YYXdXww
Liam → TX3LPaxmHKxFdv7VOQHJ
Charlotte → XB0fDUnXU5powFXDhCwa
Alice → Xb7hH8MSUJpSbSDYk0k2
Matilda → XrExE9yKIg1WjnnlVkGX
Will → bIHbv24MWmeRgasZH58o
Jessica → cgSgspJ2msm6clMCkdW9
Eric → cjVigY5qzO86Huf0OWal
Chris → iP95p4xoKVk53GoZ742B
Brian → nPczCjzI2devNBz1zQrb
Daniel → onwK4e9ZLuTAKqWW03F9
Lily → pFZP5JQG7iQjIQuC4Bku
Bill → pqHfZKP75CvOlQylNhV4
"""