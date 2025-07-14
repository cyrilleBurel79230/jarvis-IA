import cv2
import easyocr
import os

reader = easyocr.Reader(['fr'], gpu=False)

def scanner_bouteille():

    # 📷 Initialisation webcam
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ Webcam non détectée.")
        exit()

    print("📸 Appuie sur Espace pour capturer l'image, Échap pour quitter.")

    

    while True:
        
        ret, frame = cap.read()
        if not ret:
            print("❌ Impossible de lire le flux vidéo.")
            break
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
            exit()

    cap.release()
    cv2.destroyAllWindows()

    # 🔍 OCR avec EasyOCR
    reader = easyocr.Reader(['fr'], gpu=False)
    if not os.path.exists("bouteille.jpg"):
        print("❌ Image non trouvée.")
        exit()
   # 🔍 OCR sur l'image capturée
    results = reader.readtext("bouteille.jpg", detail=0)
    print("\n🔎 Texte détecté :")
    for line in results:
        print(f"- {line}")

    texte_trouvé = " ".join(results)
    print(f"🔎 Texte détecté : {texte_trouvé}")
    return texte_trouvé

