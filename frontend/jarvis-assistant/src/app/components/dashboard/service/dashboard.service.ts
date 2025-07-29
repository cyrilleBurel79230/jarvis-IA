import { Injectable } from '@angular/core';
import { CaveService } from '../../cave/service/cave.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VoiceService } from '../../voice-command/service/voice.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private caveService: CaveService,private voiceService:VoiceService) {}

  

/*
  getAllSummaries(): Observable<Record<string, string>> {
    return forkJoin({
      cave: this.caveService.getStats().pipe(
      map(result => result.totalBottles.toString()) // On s'assure que le résultat est une string
      //cave: this.caveService.getDashboardSummary().pipe(
        // On s'assure que chaque observable renvoie une string simple
        // Si c'est déjà le cas, cette étape peut être ignorée
        //map(result => result.summary)
      )
      // Tu peux ajouter d’autres sources ici, par exemple :
      // cellar2: this.otherCave.getDashboardSummary().pipe(map(r => r.summary))
    });
  }
    */
}