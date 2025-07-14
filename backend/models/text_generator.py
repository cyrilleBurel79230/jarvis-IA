from transformers import pipeline
from huggingface_hub import login
import torch
import os
from dotenv import load_dotenv

load_dotenv()  # Charge le .env
token = os.getenv("HF_TOKEN")

if not token:
    raise ValueError("Token Hugging Face manquant dans .env")
# Connexion à Hugging Face
login(token=token)

try:
    # Modèle premium (nécessite accès)
    text_gen_pipeline = pipeline("text-generation", model="mistralai/Mistral-7B-v0.1")
    #text_gen_pipeline = pipeline("text-generation", model="bigscience/bloom-560m")
except Exception:
    # Modèle de secours
    print('modele de secour')
    text_gen_pipeline = pipeline("text-generation", model="tiiuae/falcon-rw-1b")

