import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechToTextService {
  private apiUrl = 'http://localhost:5000/speech-to-text';

  constructor(private http: HttpClient) {}

  speechToText(audioFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('audio', audioFile, audioFile.name);
    return this.http.post(this.apiUrl, formData);
  }
}
