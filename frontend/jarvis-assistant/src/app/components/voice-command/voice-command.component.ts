import { Component,OnInit,AfterViewInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared';
import { VoiceService } from './service/voice.service';
import { PlatformService } from '../../core/services/platform.service';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';


declare interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}


@Component({
  selector: 'app-voice-command',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './voice-command.component.html',
  styleUrl: './voice-command.component.css'
})
export class VoiceCommandComponent implements OnInit, AfterViewInit {

  commandText:string = '';
  jarvisReply = '';
  
  private askSub: Subscription | null = null;

  reponseJarvis = "Bonjour Monsieur, je suis JARVIS. Comment puis-je vous aider aujourd'hui ?";
  constructor(
        private voiceService: VoiceService,
        private platformService: PlatformService,
        private cdr: ChangeDetectorRef
  ) {}
 
// il faudra utiliser detectChange() quand on passera par une api
  onVoiceResponse(text: string) {
    this.jarvisReply = text;
    this.cdr.detectChanges(); // 💡 déclenche le rafraîchissement du template
  }

  ngAfterViewInit(): void {
    // Initialisation de la reconnaissance vocale après que la vue soit complètement chargée
    console.log('VoiceCommandComponent view initialized');
    if(this.platformService.isBrowser()) {
      console.log('Le composant est exécuté dans un navigateur');
      this.setupVoiceRecognition();
    } else {
      console.warn('La reconnaissance vocale n\'est pas supportée dans cet environnement');
    }
    
    // Appel de la méthode pour obtenir le résumé de la commande vocale
  //  this.getResumeVoiceCommand(this.reponseJarvis);

     

  }
  
  ngOnInit(): void {
      // Initialisation du composant
      console.log('VoiceCommandComponent initialized');
      if(this.platformService.isBrowser()) {
        console.log('Le composant est exécuté dans un navigateur');
        this.voiceService.initializeRecognition((text: string) => {
            console.log('🎤 Commande reçue :', text);

            const commande = text.toLowerCase();

            if (!commande.includes('jarvis')) return; // Wake word

            if (commande.includes('météo')) {
              this.voiceService.speakForModule("Voici la météo du jour.", 'meteo', 'jarvis');
            } else if (commande.includes('bonjour')) {
              this.voiceService.speakForModule("Bonjour Cyrille, content de te revoir.", 'greeting', 'jarvis');
            } else {
              this.voiceService.speakForModule("Commande non reconnue.", 'error', 'jarvis');
            }
         });
       
    }
    
    // Appel de la méthode pour obtenir le résumé de la commande vocale
    //this.getResumeVoiceCommand(this.message);
    
    this.voiceService.replySubject.subscribe(text => {
        //this.jarvisReply = text; // 🖥️ affichage en parallèle
        this.onVoiceResponse(text); // 🖥️ affichage en parallèle 
        console.log('jarvisReply:', this.jarvisReply);
      });

    
  }


 handleCommand(command: string) {
    // 🚀 Commandes personnalisées
    if (command.includes('bonjour')) {
      this.voiceService.speakForModule('Bonjour Monsieur ! Comment puis-je vous aider ?', 'ui', 'jarvis');
      this.reponseJarvis = 'Bonjour Monsieur ! Comment puis-je vous aider ?';
    } else if (command.includes('active l’alarme')) {
      this.activateAlarm();
    
    } else {
   
      if (this.askSub) {
         this.askSub.unsubscribe(); // annule la précédente requête si encore active
      }
      this.askSub = this.voiceService.ask(command).subscribe({
        next: res => {
          this.reponseJarvis = res.response;
          this.voiceService.speakForModule(res.response, 'ui', 'jarvis');
          this.onVoiceResponse(this.reponseJarvis); // 🖥️ affichage en parallèle
          console.log('Réponse de Jarvis:', this.reponseJarvis);
        },
        error: err => console.error('Erreur Backend:',err)
      })
      
    }
   
   
  }

  cancelAsk() {
  this.askSub?.unsubscribe();
  this.askSub = null;
  this.voiceService.stopSpeaking();
}
 activateAlarm() {
    // 💥 Exemple de méthode
    console.log('Alarme activée');
    this.voiceService.speakForModule('Alarme activée.', 'ui', 'jarvis');
  }

  
  // le module voice command
  getResumeVoiceCommand(message: string): void {
    this.voiceService.speakForModule(message, 'dashboard', 'jarvis');
    
  }
  

/**
  startVoiceNavigation(){
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'fr-FR'; // Définir la langue à français
    recognition.interimResults = true; // Activer les résultats intermédiaires
    recognition.continuous = true; // Activer la reconnaissance continue

  }
    */

}
