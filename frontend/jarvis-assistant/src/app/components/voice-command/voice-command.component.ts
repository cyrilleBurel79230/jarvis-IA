import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared';

@Component({
  selector: 'app-voice-command',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './voice-command.component.html',
  styleUrl: './voice-command.component.css'
})
export class VoiceCommandComponent {
  speak(){

    // Logique pour déclencher la lecture vocale
    console.log('Lecture vocale activée');
    // Vous pouvez appeler ici le service de voix si nécessaire
    // this.voiceService.speak('Votre texte à lire');

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

  }
  startVoiceNavigation(){
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'fr-FR'; // Définir la langue à français
    recognition.interimResults = true; // Activer les résultats intermédiaires
    recognition.continuous = true; // Activer la reconnaissance continue

  }

}
