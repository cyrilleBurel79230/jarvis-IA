def detecte_commande(text: str) -> str:
    texte = text.lower()

    commandes = {
        "scan": ["scanner une bouteille", "scan bouteille", "scanne une bouteille", "scan vin"],
        "ajout d'une bouteille": ["ajoutez une bouteille","ajoute une bouteille", "ajouter une bouteille", "ajoute un", "ajouter un", "ajoute le", "ajouter le"],
        "liste": ["affiche cave", "liste des bouteilles", "quelles bouteilles", "voir la cave"],
        "retirer": ["retire", "supprime une bouteille", "enlève une bouteille"],
        "stop":["ça suffit","stop","arrête","tais-toi"]
    }

    for action, mots_cles in commandes.items():
        if any(kw in texte for kw in mots_cles):
            return action

    return "autre"
