from vosk import Model
import os

model_path = "C:/Users/cyril/OneDrive/Documents/Projet_assistants_IA/jarvis-IA/backend/vosk-model-small-fr-0.22"  # Remplacez par le chemin absolu vers votre modèle Vosk

if not os.path.exists(model_path):
    raise RuntimeError(f"Modèle Vosk manquant : {model_path}")

vosk_model = Model(model_path)