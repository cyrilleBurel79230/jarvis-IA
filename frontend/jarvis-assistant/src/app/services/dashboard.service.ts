import { Injectable } from '@angular/core';
import { CaveService } from './cave.service';
import { GardenService } from './garden.service';
import { AgendaService } from './agenda.service';
import { DiabeteService } from './diabete.service';
import { MailService } from './mail.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private cave: CaveService,
    private diabete: DiabeteService,
    private garden: GardenService,
    private agenda: AgendaService,
    private mail: MailService
    ) { }

  getAllSummaries(): Observable<Record<string, string >> {
    return forkJoin({
      cave : this.cave.getDashboardSummary(),
      diabete : this.diabete.getDashboardSummary(),
      garden: this.garden.getDashboardSummary(),
      agenda: this.agenda.getDashboardSummary(),
      mail: this.mail.getDashboardSummary()
      });
  }



}
