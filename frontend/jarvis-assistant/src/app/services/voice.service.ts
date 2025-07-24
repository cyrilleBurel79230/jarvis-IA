import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private voiceJarvis: SpeechSynthesisVoice | null = null;
  
  constructor() {
    // Chargement des voix disponibles
    speechSynthesis.onvoiceschanged = () => {
        const voices = speechSynthesis.getVoices();
        this.voiceJarvis = voices.find(voice => voice.name.includes('Google UK') || voice.lang === 'en-GB') ?? null;
       
    } 
   }
 // 
   speakForModule(text: string, domain: string, assistant: 'jarvis' ){
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = assistant === 'jarvis' ? 0.9 : 1.2; // Vitesse de la voix
    utter.pitch = assistant === 'jarvis' ? 0.75 : 0.5; // Hauteur de la voix
    utter.volume = 1; // Volume de la voix
    utter.lang = 'en-GB';
    utter.voice = this.voiceJarvis;

    utter.onstart = () => {
      console.log(`Speaking with ${assistant} in ${domain} domain: ${text}`);
    }
    utter.onend = () => {
      console.log(`Finished speaking with ${assistant} in ${domain} domain`);
    }
    utter.onerror = (event) => {
      console.error(`Error speaking with ${assistant} in ${domain} domain:`, event.error);
    } 
    // Vérification que les voix sont chargées avant de parler
    if (this.voiceJarvis) {
      speechSynthesis.speak(utter);
    } else {
      console.warn('Voices not loaded yet, retrying...');
      setTimeout(() => this.speakForModule(text, domain, assistant), 1000);
    }  


    if (!this.voiceJarvis ) {
      console.warn('Voices not loaded yet');
      return;
    }
    speechSynthesis

  }    
  // Animation de barre vocale
  private activateVoiceBar(active: boolean): void {
    const bar = document.querySelector('.jarvis-voice-bar'); {
      if (bar) {
        bar.classList.toggle('speaking', active);
      }
    }
  }
}
