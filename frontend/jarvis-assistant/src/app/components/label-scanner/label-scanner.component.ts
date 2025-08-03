import { Component } from '@angular/core';
import { createWorker, Worker } from 'tesseract.js';
import { SHARED_IMPORTS } from '../../shared/shared';

@Component({

    selector: 'app-label-scanner',
    standalone: true,
    imports: [SHARED_IMPORTS],
    templateUrl: './label-scanner.component.html',
    styleUrls: ['./label-scanner.component.css']

})
export class LabelScannerComponent {
  text: string = '';
  isProcessing: boolean = false;

  private worker: Worker = createWorker(); // ✅ PAS de await ici

 
 
 // TypeScript (ou JS)
const video = document.getElementById('video') as HTMLVideoElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

// Lancer la caméra
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});
 
// Capture image
document.getElementById('capture')!.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);
  
  const imageDataUrl = canvas.toDataURL('image/png');
  lancerOCR(imageDataUrl);
}); 
 
 
 
 
  
}
