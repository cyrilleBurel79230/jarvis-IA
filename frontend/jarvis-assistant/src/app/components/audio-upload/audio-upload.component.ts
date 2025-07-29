import { Component } from '@angular/core';
import { SpeechToTextService } from '../voice-command/service/speech-to-text.service';
import { SHARED_IMPORTS } from '../../shared/shared';

@Component({
  selector: 'app-audio-upload',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './audio-upload.component.html',
  styleUrls:['./audio-upload.component.css']
  
})
export class AudioUploadComponent {
  selectedFile?: File;
  recognizedText = '';

  constructor(private speechService: SpeechToTextService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      alert('Veuillez sélectionner un fichier audio.');
      return;
    }

    this.speechService.speechToText(this.selectedFile).subscribe({
      next: (res) => {
        // Selon format de la réponse backend
        this.recognizedText = res.text || res;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        alert('Erreur lors de la reconnaissance vocale');
      }
    });
  }
}
