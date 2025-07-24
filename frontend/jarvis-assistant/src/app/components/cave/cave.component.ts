import { Component, OnInit } from '@angular/core';
import { VoiceService } from '../../services/voice.service';
import { CaveService } from '../../services/cave.service';

@Component({
  selector: 'app-cave',
  standalone: true,
  templateUrl: './cave.component.html',
  styleUrls: ['./cave.component.scss'],
  providers: [VoiceService]
})
export class CaveComponent implements OnInit {
  zones = [
    { name: 'Zone Rouge', description: 'Millésimes Bordeaux rangés ici.', bottles: 34 },
    { name: 'Zone Blanche', description: 'Vins blancs à 10°C stockés.', bottles: 18 },
    { name: 'Chambre des millésimes', description: 'Les trésors de 1990 à 2005.', bottles: 9 },
  ];

  selectedZone: any = null;

  constructor(private cave: CaveService,private voiceService: VoiceService) {}


  selectZone(zone: any): void {
    this.selectedZone = zone;
  }
  ngOnInit():void   {
    console.log('CaveComponent initialized');
    this.cave.getWinStats().subscribe(data => {
      
      this.stats = data;
      const phrase = `Il y a ${data.total} bouteilles dans la cave, dont ${data.mature} sont mûres et ${data.alerts} ont des alertes.`; 
      this.voiceService.speakForModule(phrase, 'cave'); 
      console.log('Wine stats loaded:', this.stats);
    }); 
      
  } 


}
