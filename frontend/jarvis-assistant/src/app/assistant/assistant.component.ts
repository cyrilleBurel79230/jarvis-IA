import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SHARED_IMPORTS } from './../shared/shared';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss'],
  providers: [ApiService]
})
export class AssistantComponent implements AfterViewInit {
  @ViewChild('audioPlayback', { static: false }) audioPlayback!: ElementRef<HTMLAudioElement>;

  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];

  constructor(private apiService: ApiService) {}

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

        try {
          const response = await this.apiService.speechToText(audioBlob).toPromise();
          const text = response?.text;

          if (text) {
            console.log('Recognized text:', text);
            // Vous pouvez ajouter ici la logique pour afficher le texte reconnu dans l'interface utilisateur
          } else {
            console.error('Speech-to-text response is undefined');
          }
        } catch (error) {
          console.error('Error processing audio:', error);
        }
      };
    }).catch(error => {
      console.error('Error accessing media devices:', error);
    });
  }

  stopRecording() {
    this.mediaRecorder.stop();
  }
}