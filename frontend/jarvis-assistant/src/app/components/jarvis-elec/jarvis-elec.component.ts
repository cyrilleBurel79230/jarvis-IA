import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared';

@Component({
  selector: 'app-jarvis-elec',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './jarvis-elec.component.html',
  styleUrl: './jarvis-elec.component.css'
})
export class JarvisElecComponent implements AfterViewInit, OnDestroy {
 @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private audioCtx!: AudioContext;
  private analyser!: AnalyserNode;
  private dataArray!: Uint8Array;
  private animationId!: number;

  ngAfterViewInit() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.audioCtx = new AudioContext();
      const source = this.audioCtx.createMediaStreamSource(stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.draw();
    }).catch(err => console.error('Audio error:', err));
  }

  draw() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    this.analyser.getByteTimeDomainData(this.dataArray);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00fff7';
    ctx.shadowColor = '#00fff7';
    ctx.shadowBlur = 10;

    ctx.beginPath();

    const sliceWidth = width / this.dataArray.length;
    let x = 0;

    for (let i = 0; i < this.dataArray.length; i++) {
      const v = this.dataArray[i] / 128.0; // normaliser à 1
      const y = v * height / 2;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();

    this.animationId = requestAnimationFrame(() => this.draw());
  }

  ngOnDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.audioCtx) this.audioCtx.close();
  }
}
