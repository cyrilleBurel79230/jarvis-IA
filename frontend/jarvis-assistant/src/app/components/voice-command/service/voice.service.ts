import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';




export interface AskResponse {
    response: string;
}
@Injectable({ providedIn: 'root' })
export class VoiceService {

  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private voiceJarvis: SpeechSynthesisVoice | null = null;
  replySubject = new Subject<string>();
  speaking$ = new BehaviorSubject<boolean>(false);

  private apiUrl = 'http://localhost:8000/ask';  // adapte l’URL si besoin


  constructor(private http : HttpClient) {
    if (!this.synth) {
      console.warn('🧠 speechSynthesis non disponible dans cet environnement');
      return;
    }

    // Préchargement des voix si déjà prêtes
  
    const voices = this.synth.getVoices();
    if (voices.length) {
      this.setVoice(voices);
    } else {
      // Événement déclenché quand les voix sont disponibles
      this.synth.onvoiceschanged = () => {
        const loadedVoices = this.synth?.getVoices();
        if (loadedVoices) {
          this.setVoice(loadedVoices);
        }
      };
    }
  }

  ask(message: string): Observable<AskResponse> {
    console.log(`🔊 message ask :  ${message} `);
    return this.http.post<AskResponse>(this.apiUrl, { message });
  }


  private setVoice(voices: SpeechSynthesisVoice[]) {
    this.voiceJarvis = voices.find(voice =>
      voice.name.includes('Google FR') || voice.lang === 'fr-FR'
    ) ?? null;
  }

  speakForModule(text: string, domain: string, assistant: 'jarvis') {

    if (!this.synth) return;

    if (!this.voiceJarvis) {
      console.warn('🔁 Voix non chargée, réessai dans 1 seconde...');
      setTimeout(() => this.speakForModule(text, domain, assistant), 1000);
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = this.voiceJarvis;
    utter.lang = 'fr-FR';
    utter.rate = assistant === 'jarvis' ? 0.9 : 1.2;
    utter.pitch = assistant === 'jarvis' ? 0.75 : 0.5;
    utter.volume = 1;

    utter.onstart = () => {
      this.activateVoiceBar(true);
      this.speaking$.next(true); 
      console.log(`🔊 Lecture par ${assistant} dans le domaine ${domain}: ${text}`);
    };

    utter.onend = () => {
      this.activateVoiceBar(false);
      this.replySubject.next(text); // 🔥 broadcast de la réponse
      console.log(`✅ Lecture terminée par ${assistant} dans le domaine ${domain}`);
      console.log(`✅ replySubject ${text}`);
    };

    utter.onerror = event => {
      this.activateVoiceBar(false);
      console.error(`⚠️ Erreur de lecture :`, event.error);
    };
    
    this.synth.speak(utter);
   

  }

stopSpeaking(): void {
  if (this.synth && this.synth.speaking) {
    this.synth.cancel();
    this.activateVoiceBar(false);
    this.speaking$.next(false);
    console.log('🛑 Lecture vocale arrêtée par l’utilisateur');
  }
}


  // Affiche la barre d'animation vocale
  private activateVoiceBar(active: boolean): void {
    const bar = typeof document !== 'undefined'
      ? document.querySelector('.jarvis-voice-bar')
      : null;

    if (bar) {
      bar.classList.toggle('speaking', active);
    }
  }
    
}