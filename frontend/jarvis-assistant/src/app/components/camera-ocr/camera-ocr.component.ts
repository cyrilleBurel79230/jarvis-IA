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

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);


        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;     // R
          data[i + 1] = avg; // G
          data[i + 2] = avg; // B
          // Optionnel : boost contraste
          // data[i] = avg < 128 ? 0 : 255;
        }
        ctx.putImageData(imageData, 0, 0);

        const imageDataUrl = canvas.toDataURL('image/png');

        this.isProcessing = true;
        this.outputText = 'Analyse en cours...';

        if (typeof Tesseract === 'undefined') {
          this.outputText = 'Tesseract non chargé';
          return;
        }

        Tesseract.recognize(imageDataUrl, 'fra', {
          tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,  // ou AUTO
          logger: (m: any) => console.log(m)
        })
          .then((result: any) => {
            this.outputText = result.data.text;
            this.isProcessing = false;
          })
          .catch((err: any) => {
            console.error(err);
            this.outputText = 'Erreur OCR';
            this.isProcessing = false;
          });


  }

 




}
