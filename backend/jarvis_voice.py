from elevenlabs.client import ElevenLabs
from elevenlabs import play
import pyttsx3

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
VOICE_ID = os.getenv("VOICE_ID") # Remplace avec celle que tu veux
MODEL_ID = os.getenv("MODEL_ID")


engine = pyttsx3.init()
engine.setProperty('rate', 160)  # Vitesse de parole
engine.setProperty('volume', 1.0)


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

def jouer_phrase(phrase: str):
    print(f"🧠 Jarvis (pyttsx3) : {phrase}")
    engine.say(phrase)
    engine.runAndWait()


""" Avec elevenlabs
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
"""



# 🤖 Fonction principale
# 🧠 Lecture adaptative
def parler_en_jarvis(texte: str):

    from jarvis_terminal import interruption_active  # ⚠️ import croisé
    if interruption_active:
        print("🧠 Interruption active : Jarvis ne parlera pas.")
        return

    texte_nettoye = clean_response(texte)
    if len(texte_nettoye) > 250:
        phrases = re.split(r'[.!?]', texte_nettoye)
        for phrase in phrases:
            phrase = phrase.strip()
            if len(phrase) > 2 and not interruption_active:
                jouer_phrase(phrase)
    else:
        if not interruption_active:
            jouer_phrase(texte_nettoye)


""" Avec elevenlabs
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

