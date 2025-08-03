import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared';

declare const Tesseract: any;

@Component({
  selector: 'app-camera-ocr',
   standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './camera-ocr.component.html',
  styleUrls: ['./camera-ocr.component.css']
})
export class CameraOcrComponent implements AfterViewInit{
   @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  
  outputText: string = '';
  isProcessing = false;
  private worker: any;

isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
}
  async ngAfterViewInit() {
    if (this.isBrowser() && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          const video = this.videoRef.nativeElement;
          video.srcObject = stream;
          video.play();
        })
        .catch(err => console.error('Erreur caméra :', err));

      // Créer worker Tesseract global
     
      this.worker = Tesseract.createWorker({
        logger: (m: any) => console.log(m)
      });
      await this.worker.load();
      await this.worker.loadLanguage('fra');
      await this.worker.initialize('fra');
      await this.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789éèàçÉÈÀÇ:-,.() ',
        preserve_interword_spaces: '1',
        tessedit_pageseg_mode: '6'
      });
    } else {
      console.error('getUserMedia non supporté');
    }
  }


 async captureAndAnalyze() {
  const video = this.videoRef.nativeElement;
  const canvas = this.canvasRef.nativeElement;
  const ctx = canvas.getContext('2d')!;

  // 📏 Taille normale (évite le flou dû à l'agrandissement)
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 🧪 Image brute sans binarisation
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 🧠 Appliquer un filtre de netteté douce
  const sharpened = this.applySharpenFilter(imageData);
  ctx.putImageData(sharpened, 0, 0);

  // 📸 Convertir en image base64
  const imageDataUrl = canvas.toDataURL('image/png');

  this.isProcessing = true;
  this.outputText = 'Analyse en cours...';

  if (!this.worker) {
    this.outputText = 'Worker Tesseract non initialisé';
    this.isProcessing = false;
    return;
  }

  try {
    const result = await Tesseract.recognize(
      imageDataUrl,
      'fra',
      {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789éèàçÉÈÀÇ:-,.() ',
        preserve_interword_spaces: '1',
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        logger: (m: any) => console.log(m),
      }
    );

    this.outputText = result.data.text.trim();
    console.log('Texte OCR :', this.cleanText(this.outputText));

  } catch (err) {
    console.error(err);
    this.outputText = 'Erreur OCR';
  } finally {
    this.isProcessing = false;
  }
}


applySharpenFilter(imageData: ImageData): ImageData {
  const weights = [
    0, -1,  0,
   -1,  5, -1,
    0, -1,  0
  ];
  const side = 3;
  const halfSide = Math.floor(side / 2);

  const src = imageData.data;
  const sw = imageData.width;
  const sh = imageData.height;
  const output = new ImageData(sw, sh);
  const dst = output.data;

  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      let r = 0, g = 0, b = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            const srcOffset = (scy * sw + scx) * 4;
            const wt = weights[cy * side + cx];
            r += src[srcOffset] * wt;
            g += src[srcOffset + 1] * wt;
            b += src[srcOffset + 2] * wt;
          }
        }
      }
      const dstOffset = (y * sw + x) * 4;
      dst[dstOffset] = Math.min(255, Math.max(0, r));
      dst[dstOffset + 1] = Math.min(255, Math.max(0, g));
      dst[dstOffset + 2] = Math.min(255, Math.max(0, b));
      dst[dstOffset + 3] = src[dstOffset + 3]; // alpha
    }
  }

  return output;
}


cleanText(text: string): string {
  return text.replace(/[^a-zA-Z0-9éèàçÉÈÀÇ\s\-.,():]/g, '').trim();
}



}
