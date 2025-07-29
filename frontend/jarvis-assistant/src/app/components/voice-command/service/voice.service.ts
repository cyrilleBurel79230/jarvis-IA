import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VoiceService {

  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private voiceJarvis: SpeechSynthesisVoice | null = null;

  constructor() {
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
      console.log(`🔊 Lecture par ${assistant} dans le domaine ${domain}: ${text}`);
    };

    utter.onend = () => {
      this.activateVoiceBar(false);
      console.log(`✅ Lecture terminée par ${assistant} dans le domaine ${domain}`);
    };

    utter.onerror = event => {
      this.activateVoiceBar(false);
      console.error(`⚠️ Erreur de lecture :`, event.error);
    };

    this.synth.speak(utter);
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