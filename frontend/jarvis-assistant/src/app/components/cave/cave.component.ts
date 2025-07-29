import { Component, OnInit } from '@angular/core';
import { VoiceService } from '../voice-command/service/voice.service';
import { CaveService } from '../cave/service/cave.service';
import { SHARED_IMPORTS } from '../../shared/shared';


@Component({
  selector: 'app-cave',
  standalone: true,
  imports: [SHARED_IMPORTS],
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

  constructor(private caveService: CaveService, public voiceService: VoiceService) {}

  ngOnInit(): void {
    /*
     this.caveService.getStats().subscribe(stats => {
    console.log('📊 Statistiques cave :', stats);
    });*/

    console.log('CaveComponent initialized');
    /*
    this.caveService.getWineStats().subscribe(data => {
      this.stats = data;
      const phrase = `Il y a ${data.total} bouteilles dans la cave, dont ${data.mature} sont mûres et ${data.alerts} ont des alertes.`; 
      this.voiceService.speakForModule(phrase, 'cave', 'jarvis');
      console.log('Wine stats loaded:', this.stats);
    });*/
  }

speakZone(zone: any): void {
  const phrase = `Vous avez sélectionné ${zone.name}. ${zone.description}`;
  this.voiceService.speakForModule(phrase, 'cave', 'jarvis');
}

}