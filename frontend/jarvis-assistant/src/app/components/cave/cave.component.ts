import { Component, OnInit } from '@angular/core';
import { VoiceService } from '../voice-command/service/voice.service';
import { CaveService } from '../cave/service/cave.service';
import { SHARED_IMPORTS } from '../../shared/shared';
import { VoiceCommandComponent } from '../voice-command/voice-command.component';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { CameraOcrComponent } from '../camera-ocr/camera-ocr.component';




@Component({
  selector: 'app-cave',
  standalone: true,
  imports: [SHARED_IMPORTS,VoiceCommandComponent,CameraOcrComponent],
  templateUrl: './cave.component.html',
  styleUrls: ['./cave.component.css']
})
export class CaveComponent implements OnInit {
  stats = { total: 0, mature: 0, alerts: 0 };

  zones = [
    { name: 'Zone Rouge', description: 'Millésimes Bordeaux rangés ici.', bottles: 34 },
    { name: 'Zone Blanche', description: 'Vins blancs à 10°C stockés.', bottles: 18 },
    { name: 'Chambre des millésimes', description: 'Les trésors de 1990 à 2005.', bottles: 9 },
  ];

  selectedZone: any = null;
  

 slots = Array.from({ length: 24 }, (_, i) => i + 1);

  temperature = 12; // mock valeur °C
  humidity = 68; // mock %

 

  bottles = [
    { nom: 'Château Margaux', annee: '2015', prix: '10 euros',ajoutDate:'02/08/2025',capacite:'Magnum',quantite: '2',alcool:'13,5%',pays:'France',region:'Bordeaux',sousRegion:'Médoc',appellation:'Haut-Medoc',emplacement:'A2',garde:'Maintenant',cepages:'Merlot',accords:'Amuse-bouche',offert:'Thierry',score:0}
    
    // ...ajoute ici tes bouteilles
  ];

   newBottle = {
    nom: '',
    annee: '',
    prix: '',
    ajoutDate: '',
    capacite: '',
    quantite: '',
    alcool: '',
    pays: '',
    region: '',
    sousRegion: '',
    appellation: '',
    emplacement: '',
    garde: '',
    cepages: '',
    accords: '',
    offert:'',
    score: 0
  };

 

  
  constructor(
              private caveService: CaveService,
              public voiceService: VoiceService,
              private http: HttpClient,
              private router: Router
          ) {}

  ngOnInit(): void {
    
    this.caveService.getStats().subscribe(stats => {
    console.log('📊 Statistiques cave :', stats);
    });

    console.log('CaveComponent initialized');
    this.loadSensors();

    this.caveService.getWineStats().subscribe(data => {
      this.stats = data;
      const phrase = `Il y a ${data.total} bouteilles dans la cave, dont ${data.mature} sont mûres et ${data.alerts} ont des alertes.`; 
      this.voiceService.speakForModule(phrase, 'cave', 'jarvis');
      console.log('Wine stats loaded:', this.stats);
    });
  }

speakZone(zone: any): void {
  const phrase = `Vous avez sélectionné ${zone.name}. ${zone.description}`;
  this.voiceService.speakForModule(phrase, 'cave', 'jarvis');
}

loadSensors() {
    this.http.get<{ temperature: number; humidity: number }>('')
      .subscribe(data => {
        this.temperature = data.temperature;
        this.humidity = data.humidity;
      }, err => {
        console.error('Erreur récupération capteurs', err);
      });
  }

addBottle() {
    if (this.newBottle.nom && this.newBottle.annee && this.newBottle.quantite && this.newBottle.score > 0) {
      this.bottles.push({...this.newBottle});
      alert('Bouteille ajoutée avec succès !');
      this.resetForm();
    } else {
      alert('Merci de remplir les champs obligatoires et de donner une note.');
    }
  }
  resetForm() {
    this.newBottle = {
      nom: '',
      annee: '',
      prix: '',
      ajoutDate: '',
      capacite: '',
      quantite: '',
      alcool: '',
      pays: '',
      region: '',
      sousRegion: '',
      appellation: '',
      emplacement: '',
      garde: '',
      cepages: '',
      accords: '',
      offert:'',
      score: 0
    };
  }

  setRating(star: number) {
    this.newBottle.score = star;
  }
  goToScanner() {
    this.router.navigate(['/scanner']); // remplace '/scanner' par le chemin réel de ton composant
  }

}