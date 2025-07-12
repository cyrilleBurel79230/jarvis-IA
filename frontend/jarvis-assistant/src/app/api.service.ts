import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000'; // URL du backend Flask

  constructor(private http: HttpClient) { }

  speechToText(audio: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('audio', audio, 'recording.wav');
    return this.http.post(`${this.apiUrl}/speech-to-text`, formData);
  }

  realTimeSpeechToText(): Observable<any> {
    return this.http.post(`${this.apiUrl}/real-time-speech-to-text`, {});
  }
}