import { Component, OnInit } from '@angular/core';
import { DashboardService } from './service/dashboard.service';
import { VoiceService } from '../voice-command/service/voice.service';
import { VoiceCommandComponent } from "../voice-command/voice-command.component"; // Assurez-vous d'importer le service de voix si nécessaire  
import { SHARED_IMPORTS } from '../../shared/shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_IMPORTS,VoiceCommandComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
  
})
export class DashboardComponent implements OnInit {
  summaries: Record<string,string> = {}; // Tableau pour stocker les résumés
  
  
  constructor(
    private dashboardService: DashboardService, // Injecter le service pour les fonctionnalités du tableau de bord
   private voiceService: VoiceService // Injecter le service de voix pour la lecture vocale
  ) { }

  ngOnInit(): void {
    // Initialisation du composant
    console.log('DashboardComponent initialized');
   

   /*
    this.dashboardService.getAllSummaries().subscribe(data => {
        this.summaries = data;
        // Lecture vocale du résumé cave à l'ouverture du tableau de bord
        this.voiceService.speakForModule(data['cave'],'cave', 'jarvis');
        console.log('Summaries loaded:', this.summaries);
    }); 
    */
  }

  // Méthodes supplémentaires pour le tableau de bord peuvent être ajoutées ici
  // Par exemple, pour récupérer des données ou gérer des interactions utilisateur

}
