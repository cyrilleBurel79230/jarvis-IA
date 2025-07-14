import os
from dotenv import load_dotenv
from mistralai import Mistral

# Récupérer la clé API depuis une variable d’environnement
#api_key = os.getenv("MISTRAL_API_KEY")
load_dotenv()  # Charge le .env
api_key = os.getenv("MISTRAL_API_KEY")
print(f"Clé API : {api_key}")

client = Mistral(api_key=api_key)
response = client.chat.complete(
    model="mistral-small-latest",
    messages=[{"role": "user", "content": "Bonjour, peux-tu m'expliquer la théorie de la relativité ?"}]
)
print("Réponse d emistral:",response.choices[0].message.content)



