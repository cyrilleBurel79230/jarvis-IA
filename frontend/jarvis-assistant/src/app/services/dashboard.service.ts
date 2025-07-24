import { Injectable } from '@angular/core';
import { CaveService } from './cave.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private cave: CaveService) {}

  getAllSummaries(): Observable<Record<string, string>> {
    return forkJoin({
      cave: this.cave.getDashboardSummary().pipe(
        // On s'assure que chaque observable renvoie une string simple
        // Si c'est déjà le cas, cette étape peut être ignorée
        map(result => result.summary)
      )
      // Tu peux ajouter d’autres sources ici, par exemple :
      // cellar2: this.otherCave.getDashboardSummary().pipe(map(r => r.summary))
    });
  }
}