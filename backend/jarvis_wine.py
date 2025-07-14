import re
from jarvis_voice import parler_en_jarvis
import json
from datetime import date
from datetime import datetime, timedelta


DB_PATH = "cave_vin.json"

def ajouter_bouteille_en_base(data):
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            cave = json.load(f)
    except FileNotFoundError:
        cave = []

    # 🗓️ Ajout automatique de la date
    data["ajoutée_le"] = date.today().isoformat()
    cave.append(data)

    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(cave, f, indent=4, ensure_ascii=False)


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


def retirer_bouteille(nom, annee):
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            cave = json.load(f)
    except FileNotFoundError:
        print("❌ Aucun fichier cave_vin.json trouvé.")
        return

    # 🔍 Filtrer les bouteilles à conserver
    cave_apres = [
        b for b in cave
        if not (b.get("nom", "").lower() == nom.lower() and str(b.get("année")) == str(annee))
    ]

    if len(cave) == len(cave_apres):
        print(f"❌ Aucune bouteille '{nom} {annee}' trouvée à retirer.")
    else:
        with open(DB_PATH, "w", encoding="utf-8") as f:
            json.dump(cave_apres, f, indent=4, ensure_ascii=False)
        print(f"✅ Bouteille '{nom} {annee}' retirée avec succès.")


def lister_bouteilles():
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            cave = json.load(f)
    except FileNotFoundError:
        print("❌ Aucune cave trouvée.")
        return

    if not cave:
        print("🕳️ La cave est vide.")
        return

    print("📦 Bouteilles en stock :\n")
    for b in cave:
        print(f"- {b['nom']} ({b['année']}) - Type : {b.get('type', 'inconnu')} - Ajoutée : {b.get('ajoutée_le', 'N/A')}")




def bouteilles_proches_expiration(seuil_jours=30):
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            cave = json.load(f)
    except FileNotFoundError:
        print("❌ Aucune cave trouvée.")
        return

    now = datetime.today()
    print(f"\n⏳ Bouteilles dont la péremption est dans {seuil_jours} jours :\n")
    found = False

    for b in cave:
        limite = b.get("consommation_max")
        if not limite:
            continue

        try:
            date_limite = datetime.fromisoformat(limite)
        except:
            continue

        if now <= date_limite <= now + timedelta(days=seuil_jours):
            print(f"- {b['nom']} ({b['année']}) à consommer avant le {limite}")
            found = True

    if not found:
        print("✅ Aucune bouteille proche de sa date limite.")
