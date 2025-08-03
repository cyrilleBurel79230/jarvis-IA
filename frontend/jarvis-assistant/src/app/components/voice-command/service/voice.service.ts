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
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;// Synthèse vocale
  private recognition: SpeechRecognition | null = null;// Reconnaissance vocale
  isListening = false; // Pour éviter les démarrages multiples
  private voiceJarvis: SpeechSynthesisVoice | null = null;// Voix sélectionnée pour Jarvis

  public speaking$ = new BehaviorSubject<boolean>(false);
  private isStopped = false;

  private apiUrl = 'http://localhost:8000/ask';  // adapte l’URL si besoin
  
  lectureTermineIA=true;
  
  
  constructor(private http : HttpClient) {
     // 🔈 Vérifie si la synthèse vocale est disponible
    
    console.log('********************* constructor VoiceService');
     if (!this.synth) {
      console.warn('🧠 speechSynthesis non disponible dans cet environnement');
      return;
    }
// 🔁 Essaie de récupérer les voix immédiatement
    const voices = this.synth.getVoices();
    if (voices.length) {
      this.setVoice(voices);// Si disponibles, sélectionne une voix
    } else {
        this.synth.onvoiceschanged = () => {
        if (!this.synth) return;
        const loadedVoices = this.synth.getVoices();
        if (loadedVoices) this.setVoice(loadedVoices);
      };
    }


  }

  ask(message: string): Observable<AskResponse> {
      console.log('********************* ask VoiceService');
    console.log(`🔊 message ask :  ${message} `);
    return this.http.post<AskResponse>(this.apiUrl, { message });
  }
  /**
   * 🔧 Sélectionne la voix à utiliser pour Jarvis
   */
  private setVoice(voices: SpeechSynthesisVoice[]) {
    console.log('********************* setVoice VoiceService');
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
  console.log('********************* cleanResponse VoiceService');
  // Supprime le gras et l'italique Markdown
  text = text.replace(/\*\*.*?\*\*/g, '');
  text = text.replace(/\*.*?\*/g, '');

  // Supprime certains symboles (*, #, •, -)
  text = text.replace(/[\*#•\-]/g, '');

  // Supprime les emojis
  const regex = emojiRegex();
  text = text.replace(regex, '');

  // ✅ Supprime les caractères non autorisés sauf lettres accentuées et ponctuation basique
  text = text.replace(/[^\p{L}\p{N}\s.,!?'"()\-]+/gu, '');

  // Réduit les espaces multiples
  text = text.replace(/\s{2,}/g, ' ');

  return text.trim();
}

  
  

  // Initialise la reconnaissance vocale continue
  initializeRecognition(onCommand: (text: string) => void): void {
    console.log('********************* initializeRecognition VoiceService');
    
    const SpeechRecognition =

      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('🎤 Reconnaissance vocale non disponible');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = true;// Écoute en continu
    this.recognition.interimResults = false;// Pas de résultats intermédiaires
    
      this.recognition.onresult = (event: any) => {
        console.log('********************* initializeRecognition recognition.onresult VoiceService');
        if(this.isListening){
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            console.log('🧠 Commande reconnue :', transcript);
            onCommand(transcript);
            this.isListening=false;
        }
      }
    
    
    this.recognition.onerror = (event: any) => {
      console.log('********************* initializeRecognition recognition.onerror VoiceService');
      console.error('❌ Erreur vocale :', event.error);
    };

    this.recognition.onend = () => {
      console.log('********************* initializeRecognition recognition.onend VoiceService');
      console.log('🔁 Session terminée – relancement...');
      //setTimeout(() => this.recognition?.start(), 7500);
   

    };
 }

 

  // Lit vocalement un texte avec voix Jarvis et animations
  speakForModule(text: string, domain: string, assistant: 'jarvis'): void {
    this.isListening=false;
      console.log('********************* speakForModule VoiceService');
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
      this.stopListening(); // stoppe l'écoute
      console.log('********************* speakForModule utter.onstart VoiceService');
    
      this.speaking$.next(true);
      console.log(`🔊 Lecture par ${assistant} dans le domaine ${domain}: ${text}`);
    };

    utter.onend = () => {
      console.log('********************* speakForModule utter.onend VoiceService');
     console.log(`✅ Lecture terminée par ${assistant}`);
     
     setTimeout(() => this.startListening(), 500); // 👈 Redémarre l'écoute avec délai
    };

    utter.onerror = (event) => {
      console.log('********************* speakForModule utter.onerror VoiceService');
        console.error('⚠️ Erreur de lecture :', (event as any).error);
    };

    this.synth.speak(utter);
    
      console.log('********************* speakForModule Fin VoiceService');
  }
  
// pour permettre d'interrompte jarvis quand il parle on decoupe en phrases
speakInChunks(text: string, voiceType: string = 'jarvis'): void {
  console.log('********************* speakInChunks VoiceService');
  if (!text || this.synth?.speaking) return; // 🔒 Ne rien faire si déjà en train de parler

  // 🧩 Découpe le texte en phrases (basé sur ponctuation)
  const sentences = text
    .split(/[\.\!\?]/) // Sépare sur les points, points d'exclamation, etc.
    .map(s => s.trim()) // Supprime les espaces inutiles
    .filter(s => s.length > 0); // Ignore les phrases vides

  let index = 0; // 📍 Position actuelle dans le tableau de phrases

  const speakNext = () => {
    if (index >= sentences.length || this.isStopped) {
      // ✅ Fin du discours ou interruption
      this.speaking$.next(false);
      this.isStopped = false;
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sentences[index]);

    // 🎙️ Sélectionne la voix selon le type
    utterance.voice = this.voiceJarvis;
    utterance.lang = 'fr-FR';
    utterance.rate = voiceType === 'jarvis' ? 0.9 : 1;
    utterance.pitch = voiceType === 'jarvis' ? 0.75 : 1;
    utterance.volume = 1;

    // 🔄 Déclenche animation ou état "parle"
    utterance.onstart = () => {
       console.log('********************* speakInChunks  utterance.onstart VoiceService');
      this.speaking$.next(true);
      console.log(`🗣️ Jarvis dit : ${sentences[index]}`);
    };

    // ⏭️ Quand la phrase est terminée, passe à la suivante
    utterance.onend = () => {
      console.log('********************* speakInChunks  utterance.onend VoiceService');
      this.speaking$.next(false);
      index++;
      setTimeout(() => speakNext(), 300); // ⏱️ Petite pause entre les phrases
    };

    // ⚠️ Gestion des erreurs
    utterance.onerror = (event) => {
      console.error('⚠️ Erreur de lecture :', event.error);
      this.isStopped = true;
    };

    // 🔊 Lance la lecture
    this.synth?.speak(utterance);
  };

  // 🚀 Démarre la lecture
  //speakNext();
}


  // Démarre l'écoute (si besoin)
  startListening(): void {
    console.log('********************* startListening VoiceService');
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
  console.log('********************* stopListening VoiceService');
  if (this.recognition && this.isListening) {
    this.recognition.stop();
    this.isStopped = true;
    this.isListening = false;
  }
}

stopSpeaking(): void {
  console.log('********************* stopSpeaking VoiceService');
  // ✅ Vérifie que le synthétiseur est disponible et qu'une lecture est en cours
  if (this.synth && this.synth.speaking) {
    this.isStopped = true;
    this.synth.cancel(); // 🛑 Arrête immédiatement toute lecture vocale
    this.speaking$.next(false);   // 🔄 Met à jour l'état observable
    console.log('🛑 Lecture vocale arrêtée par l’utilisateur');
  }
}

 // Transforme les emojis en mots lisibles
describeEmojis(text: string): string {
  const emojiMap: { [emoji: string]: string } = {
    '😀': 'souriant',
    '😄': 'sourire',
    '😂': 'rire',
    '😭': 'pleure',
    '❤️': 'coeur',
    '👍': 'pouce levé',
    '🔥': 'feu',
    '💡': 'idée',
    '🎉': 'fête',
    '🤖': 'robot',
    // ajoute ici ceux que tu veux
  };

  return text.replace(emojiRegex(), (match) => {
    return emojiMap[match] ? ` ${emojiMap[match]} ` : '';
  });
}

toggleSpeaking(text: string, voiceType: string = 'jarvis'): void {
  console.log('********************* toggleSpeaking VoiceService');
  if (this.synth?.speaking) {
    this.stopSpeaking(); // 🛑 Interrompt la lecture
  } else {
   this.startListening() // 🔊 Démarre la lecture
  }
}


}



