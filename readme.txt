commencer par install l'environnement virtuel :
python -m venv venv
.\venv\Scripts\activate

# Pour Rasa
python -m venv rasa-env
pip install rasa==3.6.21 pydantic==1.10.9


# Pour Mistral
python -m venv mistral-env
.\mistral-env\Scripts\activate

python -m pip install mistralai==1.9.2
python -m pip install pydantic==2.11.7



pip install -r requirements.txt


python test.py

pip install Flask
pip install flask-cors
pip install SpeechRecognition
pip install gTTS
pip install pydub
pip install numpy==1.24.3
pip install rasa==3.6.21

Angular @17

VOSK vosk-model-fr-0.22  pour la reconnaissance vocale
PyAudio pour capturer l'audio en temps réel 


token de HUGGINGFACE pour le model mistral: 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

pip-tools
Flask
flask-cors
SpeechRecognition
gTTS
pydub
numpy==1.24.3
rasa==3.6.21
tensorflow-intel==2.12.0
vosk

routes/__init__.py	Importe et expose les 3 Blueprints
routes/speech_to_text.py	/speech-to-text (POST avec fichier audio)
routes/real_time_speech.py	/real-time-speech-to-text (POST micro live)
routes/generate_text.py	/generate-text (POST avec prompt)

curl -H "Authorization: Bearer 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" https://api-inference.huggingface.co/models/gpt2

curl -X POST https://api-inference.huggingface.co/models/gpt2 \
     -H "Authorization: Bearer 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" \
     -H "Content-Type: application/json" \
     -d '{"inputs": "Explique-moi la bourse en français.", "parameters": {"max_new_tokens": 100, "temperature": 0.7}}'
