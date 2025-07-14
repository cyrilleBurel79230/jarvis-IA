import os
import requests
from dotenv import load_dotenv

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise ValueError("Le token Hugging Face est manquant dans le fichier .env")

response = requests.get("https://api-inference.huggingface.co/models/gpt2",
                        headers={"Authorization": f"Bearer {HF_TOKEN}"})
print("verif:", response.status_code, response.text)

API_URL = "https://api-inference.huggingface.co/models/gpt2"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

def ask_jarvis(prompt_text):
    print(f"🧠 Envoi à Jarvis (API Hugging Face) : {prompt_text}")
    payload = {
        "inputs": prompt_text,
        "parameters": {
            "max_new_tokens": 100,
            "temperature": 0.7,
            "do_sample": True
        }
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    
    if response.status_code == 200:
        result = response.json()
        # Le résultat est une liste contenant un dict avec 'generated_text'
        generated_text = result[0]["generated_text"]
        # Retirer le prompt pour ne garder que la génération
        response_text = generated_text[len(prompt_text):].strip()
        return response_text if response_text else "Pas de réponse générée."
    else:
        return f"Erreur API Hugging Face : {response.status_code} {response.text}"

# Test rapide
if __name__ == "__main__":
    prompt = "Dans un futur proche, l'humanité a découvert"
    response = ask_jarvis(prompt)
    print(f"Réponse de Jarvis : {response}")



""" En local 


from transformers import AutoModelForCausalLM, AutoTokenizer

from huggingface_hub import login
import torch
import os
from dotenv import load_dotenv

load_dotenv()  # Charge le .env
token = os.getenv("HF_TOKEN")

print("Token chargé :", token)
# Connexion à Hugging Face
login(token=token)

# Charger le tokenizer et le modèle
# Charger le tokenizer et le modèle
#model_name = "mistralai/Mistral-7B-v0.1"
model_name = "bigscience/bloom-560m"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Déplacer le modèle vers le GPU si disponible
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
print('Déplacer le modèle vers le GPU si disponible')
# Définir le token de remplissage explicitement
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token  # Utiliser eos_token comme pad_token
print('tokenizer')
# Définir une longueur maximale pour la troncature
max_length = 1024  # Ajustez cette valeur en fonction de vos besoins et des limites du modèle

# Préparer l'entrée avec attention mask et padding
input_text = "Une fois, dans un monde lointain,"
inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True, max_length=max_length).to(device)
print(inputs)
# Générer du texte
outputs = model.generate(
    input_ids=inputs.input_ids,
    attention_mask=inputs.attention_mask,
    max_length=100,  # Assurez-vous que la longueur de génération ne dépasse pas max_length
    num_return_sequences=1
)
generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(generated_text)

"""