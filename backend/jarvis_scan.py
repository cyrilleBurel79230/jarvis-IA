import cv2
import easyocr

reader = easyocr.Reader(['fr'], gpu=False)

def scanner_bouteille():
    cap = cv2.VideoCapture(0)
    print("📸 Appuie sur Espace pour capturer l'étiquette")

    while True:
        ret, frame = cap.read()
        cv2.imshow("Scanner Étiquette", frame)

        key = cv2.waitKey(1)
        if key == 32:  # espace = capture
            cv2.imwrite("bouteille.jpg", frame)
            print("📷 Étiquette capturée")
            break
        elif key == 27:  # échap = annuler
            print("❌ Scan annulé")
            cap.release()
            cv2.destroyAllWindows()
            return None

    cap.release()
    cv2.destroyAllWindows()

    # 🔍 OCR sur l'image capturée
    results = reader.readtext("bouteille.jpg", detail=0)
    texte_trouvé = " ".join(results)
    print(f"🔎 Texte détecté : {texte_trouvé}")
    return texte_trouvé