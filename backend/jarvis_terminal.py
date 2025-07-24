
from jarvis_voice import parler_en_jarvis
from jarvis_scan import scanner_bouteille
from jarvis_wine import ajouter_bouteille_depuis_scan, ajouter_bouteille_en_base
from jarvis_wine import interpreter_ajout_vocal  # à importer en haut
from jarvis_utils import detecte_commande

from mistralai import Mistral
from dotenv import load_dotenv
import os
from vosk import Model, KaldiRecognizer
import pyttsx3
import json
import wave
import pyaudio
import cv2


load_dotenv()
client_mistral = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))

# === 🎧 Configuration Vosk ===
MODEL_PATH = "C:/Users/cyril/OneDrive/Documents/Projet_assistants_IA/jarvis-IA/backend/vosk-model-small-fr-0.22"
USE_VOICE_RESPONSE = True

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Modèle Vosk non trouvé à l'emplacement : {MODEL_PATH}")

vosk_model = Model(MODEL_PATH)
recognizer = KaldiRecognizer(vosk_model, 16000)

# === 🔊 Synthèse vocale ===
engine = pyttsx3.init()
engine.setProperty('rate', 160)
if os.name == 'posix':
    engine.setProperty('voice', 'com.apple.speech.synthesis.voice.thomas')

mode_concise = True  # Active au démarrage


# === 🎤 Enregistrement audio ===
def record_audio(filename="output.wav", duration=5):
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8000)
    print("🎙️ Parle maintenant...")
  # frames = [stream.read(4000) for _ in range(0, int(16000 / 8000 * duration))]
    frames = [stream.read(8000) for _ in range(0, int(16000 / 8000 * duration))]

   
    stream.stop_stream()
    stream.close()
    p.terminate()

    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
        wf.setframerate(16000)
        wf.writeframes(b''.join(frames))

    print("✅ Enregistrement terminé.")
    return filename

# === 🧠 Reconnaissance vocale ===
def recognize(filename):
    with wave.open(filename, 'rb') as wf:
        if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
            raise ValueError("Audio non conforme : 1 canal, 16 bits, 16000 Hz requis.")

        recognizer = KaldiRecognizer(vosk_model, wf.getframerate())
        recognizer.SetWords(True)

        text = ""
        while True:
            data = wf.readframes(4000)
            if not data:
                break
            if recognizer.AcceptWaveform(data):
                result = json.loads(recognizer.Result())
                text += result.get("text", "") + " "

        final_result = json.loads(recognizer.FinalResult())
        text += final_result.get("text", "")
        return text.strip()

def jarvis_repond(prompt: str, mode_concise=False,interruption_active=False):
    if mode_concise:
        prompt = f"Réponds de façon brève, directe, sans suggestions : {prompt}"

    
    response = client_mistral.chat.complete(
        model="mistral-small-latest",
        messages=[{"role": "user", "content": prompt}]
    )
    texte = response.choices[0].message.content
    print(f"🧠 Jarvis dit : {texte}")
    parler_en_jarvis(texte,interruption_active=interruption_active)


def gestion_scan_bouteille():
    texte_ocr = scanner_bouteille()
    if not texte_ocr:
        print("Pas de text OCR de scanné")
        return

    data_bouteille = ajouter_bouteille_depuis_scan(texte_ocr)
    print("\n🆕 Détails détectés :")
    print(f"Nom          : {data_bouteille['nom']}")
    print(f"Année        : {data_bouteille['année']}")
    print(f"Type         : {data_bouteille['type']}")
    print(f"Texte brut   : {data_bouteille['texte_detecté']}")

    # 💬 Menu terminal (bouton simulé)
    print("\n💡 Voulez-vous ajouter cette bouteille à la cave ?")
    print("[1] ✅ Oui, ajouter")
    print("[2] ❌ Non, ignorer")

    choix = input("👉 Votre choix : ")
    if choix == "1":
        ajouter_bouteille_en_base(data_bouteille)
        print("📦 Bouteille ajoutée avec succès dans la cave.")
    else:
        print("⏹️ Bouteille ignorée.")





# === 🔁 Boucle principale ===
if __name__ == "__main__":
   """
    #Test de capture video 
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    print("Fonctionne ?", ret)
    cap.release()

    gestion_scan_bouteille()  # test direct
    """
   interruption_active = False  # 🛑 Interruption désactivée par défaut
      
while True:
       
        input("🟢 Appuie sur Entrée pour parler à Jarvis (ou Ctrl+C pour quitter)...")
        file = record_audio(duration=5)
        recognized = recognize(file)

        if not recognized:
            print("❌ Rien reconnu. Réessaie.")
            continue

        print(f"🗣️ Tu as dit : {recognized}")
 
        # 📷 Commande de scan
        commande = detecte_commande(recognized)
        print(f"🔍 Commande détectée : {commande}")
        if commande == "stop":
                interruption_active = True
                print("⛔ Interruption activée")
                parler_en_jarvis("D'accord, j'arrête la réponse.")
                continue

        if interruption_active:
                print("🤐 Mode silencieux actif — Jarvis ne répondra pas.")
                continue

        if commande == "ajout d'une bouteille":
            print("📸 Scanner lancé")
            gestion_scan_bouteille()
            continue
        elif commande == "liste":
            print("📦 Affichage de la cave")
            lister_bouteilles()
            continue

        elif commande == "retirer":
            print("🗑️ Retrait (fonction à implémenter)")
            # Tu peux appeler une fonction comme retirer_bouteille_vocalement(recognized)
            continue
        else:
            # 🧠 Réponse générale de Jarvis
            prompt = f"Réponds brièvement : {recognized}" if mode_concise else recognized
            jarvis_repond(prompt,mode_concise=mode_concise, interruption_active=interruption_active)
            continue

       


        
    
        


