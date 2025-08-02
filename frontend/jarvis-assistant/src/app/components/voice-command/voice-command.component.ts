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
  jarvisReply="";
  isSpeaking = false;
  private askSub: Subscription | null = null;

  reponseJarvis = "Monsieur, je suis JARVIS. Comment puis-je vous aider aujourd'hui ?";
  constructor(
        private voiceService: VoiceService,
        private platformService: PlatformService,
        private cdr: ChangeDetectorRef
  ) {}
 
// il faudra utiliser detectChange() quand on passera par une api
  onVoiceResponse(text: string) {
    
    this.cdr.detectChanges(); // 💡 déclenche le rafraîchissement du template
  }

  ngAfterViewInit(): void {
    // Initialisation de la reconnaissance vocale après que la vue soit complètement chargée
    console.log('VoiceCommandComponent view initialized');
    if(this.platformService.isBrowser()) {
      console.log('Le composant est exécuté dans un navigateur');
      
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
          if (text.toLowerCase().includes('stop') || text.toLowerCase().includes('silence')) {
            this.voiceService.stopSpeaking();
            return;
          }
          if(this.voiceService.isListening){
         
            console.log('🎤 Commande reçue :', text);
            const command = text.toLowerCase();
            if(this.voiceService.lectureTermineIA){
               console.log('🎤 lecture terminé:', text);
              this.handleCommand(command);
            }
            
          
          }
          });

          this.voiceService.speaking$.subscribe(state => {
          this.isSpeaking = state;
  });

          
      }

        
    
    
    // Appel de la méthode pour obtenir le résumé de la commande vocale
    //this.getResumeVoiceCommand(this.message);
     
  }

 

 handleCommand(command: string) {
    // 🚀 Commandes personnalisées
    if (command.includes('bonjour')) {
      this.voiceService.speakForModule('Monsieur ! Comment puis-je vous aider ?', 'ui', 'jarvis');
      this.reponseJarvis = 'Monsieur ! Comment puis-je vous aider ?';
    } else if (command.includes('active l’alarme')) {
      this.activateAlarm();
    
    } else if (command.includes('stop')){
        this.voiceService.stopSpeaking();
    
    } else {
   
      if (this.askSub) {
         this.askSub.unsubscribe(); // annule la précédente requête si encore active
      }
      this.askSub = this.voiceService.ask(command).subscribe({
        next: res => {
          this.reponseJarvis = this.voiceService.cleanResponse(res.response);
          const describedText = this.voiceService.describeEmojis(this.reponseJarvis);
      


          if (describedText.length > 100) {
            this.voiceService.speakInChunks(describedText, 'jarvis');
          } else {
            this.voiceService.speakForModule(describedText, 'ui', 'jarvis');
          }  

          this.jarvisReply=describedText;
          this.onVoiceResponse(describedText); // 🖥️ affichage en parallèle
          console.log('Réponse de Jarvis:', describedText);
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
  
  // Lancement manuel de l’écoute
 // startJarvis() {
 //   this.voiceService.startListening();
  //  this.voiceService.speakForModule("Bonjour Monsieur ! Comment puis-je vous aider ?", 'ui', 'jarvis');
  //}
  toggleJarvis() {
    const message = "Bonjour Cyrille. Je suis prêt à t’aider. Tu peux m’interrompre à tout moment.";
    this.voiceService.toggleSpeaking(message, 'jarvis');
  }


}
