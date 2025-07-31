import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import emojiRegex from 'emoji-regex';

// Add SpeechRecognition type for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
type SpeechRecognition = typeof window.SpeechRecognition;

export interface AskResponse {
    response: string;
}

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private voiceJarvis: SpeechSynthesisVoice | null = null;

  public speaking$ = new BehaviorSubject<boolean>(false);
  public replySubject = new Subject<string>();
 
  private apiUrl = 'http://localhost:8000/ask';  // adapte l’URL si besoin

  constructor(private http : HttpClient) {
    if (!this.synth) {
      console.warn('🧠 speechSynthesis non disponible dans cet environnement');
      return;
    }

    const voices = this.synth.getVoices();
    if (voices.length) {
      this.setVoice(voices);
    } else {
        this.synth.onvoiceschanged = () => {
        if (!this.synth) return;
        const loadedVoices = this.synth.getVoices();
        if (loadedVoices) this.setVoice(loadedVoices);
      };
    }
  }

  ask(message: string): Observable<AskResponse> {
    console.log(`🔊 message ask :  ${message} `);
    return this.http.post<AskResponse>(this.apiUrl, { message });
  }

  private setVoice(voices: SpeechSynthesisVoice[]) {
  // 🎯 Cherche une voix française avec un nom masculin ou évocateur
  this.voiceJarvis = voices.find(voice =>
    voice.lang === 'fr-FR' &&
    /paul|thomas|male|homme|jarvis/i.test(voice.name)
  )
  // 🔄 Sinon, prend n’importe quelle voix française
  ?? voices.find(voice => voice.lang === 'fr-FR')
  // 🛑 Sinon, aucune voix
  ?? null;

  if (this.voiceJarvis) {
    console.log(`✅ Voix Jarvis sélectionnée : ${this.voiceJarvis.name}`);
  } else {
    console.warn('⚠️ Aucune voix française disponible pour Jarvis');
  }

  // 🗣️ Pour debug : liste complète
  console.table(
    voices.map(v => ({
      nom: v.name,
      langue: v.lang,
      défaut: v.default,
    }))
  );
}

  // Nettoyage texte : enlève markdown, emojis, symboles
  cleanResponse(text: string): string {
    if (!text) return '';

    // Supprime blocs gras et italique Markdown
    text = text.replace(/\*\*.*?\*\*/g, '');
    text = text.replace(/\*.*?\*/g, '');

    // Supprime certains symboles (*, #, •, -)
    text = text.replace(/[\*#•\-]/g, '');

    // Supprime emojis avec emoji-regex
    const regex = emojiRegex();
    text = text.replace(regex, '');

    // Supprime caractères non autorisés sauf ponctuation basique
    text = text.replace(/[^\w\s.,!?'"()-]+/g, '');

    // Réduit espaces multiples
    text = text.replace(/\s{2,}/g, ' ');

    return text.trim();
  }

  // Initialise la reconnaissance vocale continue
  initializeRecognition(onCommand: (text: string) => void): void {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('🎤 Reconnaissance vocale non disponible');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = true;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log('🧠 Commande reconnue :', transcript);
      const cleanText = this.cleanResponse(transcript);
      onCommand(cleanText);
    };

    this.recognition.onerror = (event: any) => {
      console.error('❌ Erreur vocale :', event.error);
    };

    this.recognition.onend = () => {
      console.log('🔁 Session terminée – relancement...');
      setTimeout(() => this.recognition?.start(), 500);
    };

    this.recognition.start();
    this.isListening = true;
    console.log('🎧 Jarvis écoute...');
  }

 

  // Lit vocalement un texte avec voix Jarvis et animations
  speakForModule(text: string, domain: string, assistant: 'jarvis'): void {
    if (!this.synth) return;

    if (!this.voiceJarvis) {
      console.warn('🔁 Voix non chargée, réessai dans 2 secondes...');
      setTimeout(() => this.speakForModule(text, domain, assistant), 2000);
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = this.voiceJarvis;
    utter.lang = 'fr-FR';
    utter.rate = assistant === 'jarvis' ? 0.9 : 1.2;
    utter.pitch = assistant === 'jarvis' ? 0.75 : 0.5;
    utter.volume = 1;

    utter.onstart = () => {
   //   this.activateVoiceBar(true);
      this.speaking$.next(true);
      console.log(`🔊 Lecture par ${assistant} dans le domaine ${domain}: ${text}`);
    };

    utter.onend = () => {
    //  this.activateVoiceBar(false);
      this.replySubject.next(text);
      console.log(`✅ Lecture terminée par ${assistant}`);
    };

    utter.onerror = (event) => {
  //    this.activateVoiceBar(false);
      console.error('⚠️ Erreur de lecture :', (event as any).error);
    };

    this.synth.speak(utter);
  }
  
  // Démarre l'écoute (si besoin)
  startListening(): void {
  if (!this.recognition) {
    console.warn('❌ Recognition non initialisée. Appelle initializeRecognition() d’abord.');
    return;
  }

  if (this.isListening) {
    console.log('⏳ Jarvis écoute déjà.');
    return;
  }

  try {
    this.recognition.start();
    this.isListening = true;
    console.log('🎧 Jarvis écoute...');
  } catch (error: any) {
    if (error.name === 'InvalidStateError') {
      console.warn('⚠️ Recognition déjà en cours :', error.message);
    } else {
      console.error('❌ Erreur inattendue dans startListening :', error);
    }
    this.isListening = false;
  }
}
stopListening(): void {
  if (this.recognition && this.isListening) {
    this.recognition.stop();
    this.isListening = false;
  }
}
  // Animation visuelle voix (à implémenter selon UI)
 // private activateVoiceBar(active: boolean): void {
    // Exemple : déclencher une animation CSS ou une LED virtuelle
 //   console.log('🎨 Animation voix', active ? 'activée' : 'désactivée');
  //}
}



