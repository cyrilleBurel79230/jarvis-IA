import os
from dotenv import load_dotenv
from transformers import pipeline
from huggingface_hub import login
import torch

# 1. Charger le .env
load_dotenv()
token = os.getenv("HF_TOKEN")

if not token:
    raise ValueError("⚠️ Token Hugging Face introuvable dans le .env")

# 2. Connexion à Hugging Face
try:
    login(token=token)
    print("✅ Connexion Hugging Face réussie")
except Exception as e:
    print(f"❌ Erreur de connexion à Hugging Face : {e}")
    exit(1)

# 3. Chargement du modèle
try:
    generator = pipeline(
        "text-generation",
        #model="mistralai/Mistral-7B-v0.1",
        model="bigscience/bloom-560m",
        torch_dtype=torch.float32,
        truncation=True, # <-- ici, dans la définition du pipeline
        pad_token_id=2  # correspond souvent à eos_token_id
    )
    print("✅ Modèle chargé avec succès")
except Exception as e:
    print(f"❌ Erreur de chargement du modèle : {e}")
    exit(1)

# 4. Prompt de test
prompt = "Raconte-moi une blague courte en français"

# 5. Génération de texte
try:
    results = generator(
        prompt,
        max_length=60,
        num_return_sequences=1
    )
    print("🧠 Texte généré :")
    print(results[0]['generated_text'])
except Exception as e:
    print(f"❌ Erreur de génération : {e}")
