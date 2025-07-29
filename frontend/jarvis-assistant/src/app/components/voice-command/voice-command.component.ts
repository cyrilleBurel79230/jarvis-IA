import { Component,OnInit,AfterViewInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared';
import { VoiceService } from './service/voice.service';
import { PlatformService } from '../../core/services/platform.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-voice-command',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './voice-command.component.html',
  styleUrl: './voice-command.component.css'
})
export class VoiceCommandComponent implements OnInit, AfterViewInit {

  recognition: any
  commandText:string = '';
  jarvisReply = '';


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
        this.setupVoiceRecognition();
       
    }
    
    // Appel de la méthode pour obtenir le résumé de la commande vocale
    //this.getResumeVoiceCommand(this.message);
    
    this.voiceService.replySubject.subscribe(text => {
        //this.jarvisReply = text; // 🖥️ affichage en parallèle
        this.onVoiceResponse(text); // 🖥️ affichage en parallèle 
        console.log('jarvisReply:', text);
      });

    
  }

  setupVoiceRecognition() {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            this.recognition = new SpeechRecognition();
      } else {
            console.warn('Reconnaissance vocale non supportée sur ce navigateur.');
      }

    
      this.recognition.lang = 'fr-FR';
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
      this.commandText = event.results[0][0].transcript;
      this.handleCommand(this.commandText);
    };
  }

 handleCommand(command: string) {
    // 🚀 Commandes personnalisées
    if (command.includes('bonjour')) {
      this.voiceService.speakForModule('Bonjour Monsieur ! Comment puis-je vous aider ?', 'ui', 'jarvis');
      this.reponseJarvis = 'Bonjour Monsieur ! Comment puis-je vous aider ?';
    } else if (command.includes('active l’alarme')) {
      this.activateAlarm();
    } else {
      this.voiceService.speakForModule(`Commande reçue : ${command}`, 'ui', 'jarvis');
    }
   
   
  }
 activateAlarm() {
    // 💥 Exemple de méthode
    console.log('Alarme activée');
    this.voiceService.speakForModule('Alarme activée.', 'ui', 'jarvis');
  }

  startListening() {
    this.recognition?.start();
  }
  // le module voice command
  getResumeVoiceCommand(message: string): void {
    this.voiceService.speakForModule(message, 'dashboard', 'jarvis');
    
  }
  

/*
  speak(){
    console.log('🔊 Jarvis va parler :', this.jarvisReply);

    // Logique pour déclencher la lecture vocale
    console.log('Lecture vocale activée');
    // Vous pouvez appeler ici le service de voix si nécessaire
    //this.voiceService.speak('Votre texte à lire');

    const synth = window.speechSynthesis;
    const responseText = document.querySelector("#jarvis-response p")?.textContent || "Je suis JARVIS, prêt à vous assister";
    const utter = new SpeechSynthesisUtterance(responseText);
    utter.lang = 'fr-FR'; // Définir la langue à français 

    utter.onstart = () =>{
      document.getElementById("Jarvis-response")?.classList.add("speaking");
    };
    utter.onend = () =>{
      document.getElementById("Jarvis-response")?.classList.remove("speaking");
    }
    synth.speak(utter);
    // Vous pouvez également ajouter des options de voix, de volume, etc. si nécessaire
    console.log('Lecture vocale terminée');

  }*/
  startVoiceNavigation(){
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'fr-FR'; // Définir la langue à français
    recognition.interimResults = true; // Activer les résultats intermédiaires
    recognition.continuous = true; // Activer la reconnaissance continue

  }

}
