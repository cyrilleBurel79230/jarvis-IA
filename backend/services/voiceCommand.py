from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, HTTPException
from mistralai import Mistral
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:4200",  # frontend Angular
    # "http://127.0.0.1:4200",  # optionnel si tu utilises cette forme aussi
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # autorise ton frontend Angular
    allow_credentials=True,
    allow_methods=["*"],                # autorise tous les types de requêtes (GET, POST, etc.)
    allow_headers=["*"],                # autorise tous les headers
)

api_key = os.getenv("MISTRAL_API_KEY")
if not api_key:
    raise RuntimeError("Clé API Mistral manquante")

client = Mistral(api_key=api_key)

#Pour savoir les noms des models de IA
#models = client.models.list()
#for m in models.data:
#    print(m.id)

@app.post("/ask")
async def ask_mistral(request: Request):
    data = await request.json()
    print( data.get("message") )
    user_message = data.get("message")

    try:
        response = client.chat.complete(
            model="mistral-small-2506",
            messages=[{"role": "user", "content": user_message}]
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        print(f"[Erreur Mistral] {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'appel à Mistral")
