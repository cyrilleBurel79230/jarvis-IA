import { Component } from '@angular/core';
import { SHARED_IMPORTS } from './shared/shared';
import { DashboardComponent } from './components/dashboard/dashboard.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [  SHARED_IMPORTS, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  titre = 'jarvis-assistant';

// Ajout d'effet visuel ou autres comportements globaux
}

