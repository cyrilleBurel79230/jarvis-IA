import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SpeechToTextService } from '../../services/speech-to-text.service';


@Component({
  selector: 'app-audio-upload',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './audio-upload.component.html',
  styleUrls:['./audio-upload.component.scss'],
  providers:[SpeechToTextService]  
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
