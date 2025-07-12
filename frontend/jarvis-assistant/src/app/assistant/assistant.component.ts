import { Component, ViewChild, ElementRef ,AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements AfterViewInit {
  @ViewChild('audioPlayback', { static: false }) audioPlayback!: ElementRef<HTMLAudioElement>;

  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];

  constructor(private http: HttpClient) {}

    ngAfterViewInit() {
    // Initialisation après que la vue soit prête
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();

      this.mediaRecorder.ondataavailable = event => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        const response = await this.http.post<{ text: string }>('http://localhost:5000/speech-to-text', formData).toPromise();
        const text = response?.text;


        if (text) {
          const ttsResponse = await this.http.post<{ audio_url: string }>('http://localhost:5000/text-to-speech', { text }).toPromise();

          if (ttsResponse) {
            this.audioPlayback.nativeElement.src = ttsResponse.audio_url;
            this.audioPlayback.nativeElement.play();
          } else {
            console.error('Text-to-speech response is undefined');
          }
        } else {
          console.error('Speech-to-text response is undefined');
        }
      };
    });
  }

  stopRecording() {
    this.mediaRecorder.stop();
  }
}