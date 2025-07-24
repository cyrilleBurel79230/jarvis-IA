# 📦 Image de base Python
FROM python:3.11-slim

# 👓 Définir le dossier de travail
WORKDIR /app

# 📂 Copier les fichiers du projet
COPY backend/ ./backend/
COPY requirements-ia.txt ./

# 🔧 Installer les dépendances
RUN pip install --upgrade pip \
    && pip install -r requirements-ia.txt

# 🎙️ Exposer le port si nécessaire (ex : API Flask)
EXPOSE 5000

# 🚀 Commande de lancement
CMD ["python", "backend/jarvis_terminal.py"]
