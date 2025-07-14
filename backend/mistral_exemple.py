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



