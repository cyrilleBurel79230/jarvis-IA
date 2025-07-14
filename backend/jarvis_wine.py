import re
from jarvis_voice import parler_en_jarvis

def ajouter_bouteille_depuis_scan(texte_brut):
    # 🧼 Analyse de l'année (millésime)
    annee_match = re.search(r'\b(19|20)\d{2}\b', texte_brut)
    annee = annee_match.group() if annee_match else "inconnue"

    # 🔍 Type supposé (Bordeaux, Bourgogne…)
    type_match = re.search(r'(Bordeaux|Bourgogne|Côtes-du-Rhône|Champagne|Alsace|Chablis)', texte_brut, re.IGNORECASE)
    type_vin = type_match.group().title() if type_match else "Non identifié"

    # 🏷️ Nom supposé (le plus long mot capitalisé)
    mots = [m for m in texte_brut.split() if m[0].isupper()]
    nom = " ".join(mots[:3]) if mots else "Nom inconnu"

    # 💬 Confirmation vocale via Jarvis
    phrase = f"Bouteille détectée : {nom}, année {annee}, type {type_vin}. Souhaitez-vous l'ajouter à votre cave ?"
    parler_en_jarvis(phrase)

    # 📦 Retour des données pour ajout manuel ou en base
    return {
        "nom": nom,
        "année": annee,
        "type": type_vin,
        "texte_detecté": texte_brut
    }