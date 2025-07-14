import cv2
import easyocr
import os

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

    cv2.imshow("Test Webcam", frame)
    key = cv2.waitKey(100)

    if key == 32:  # Espace
        cv2.imwrite("test_bouteille.jpg", frame)
        print("✅ Image capturée : test_bouteille.jpg")
        break
    elif key == 27:  # Échap
        print("⏹️ Capture annulée.")
        cap.release()
        cv2.destroyAllWindows()
        exit()

cap.release()
cv2.destroyAllWindows()

# 🔍 OCR avec EasyOCR
reader = easyocr.Reader(['fr'], gpu=False)

if not os.path.exists("test_bouteille.jpg"):
    print("❌ Image non trouvée.")
    exit()

results = reader.readtext("test_bouteille.jpg", detail=0)
print("\n🔎 Texte détecté :")
for line in results:
    print(f"- {line}")