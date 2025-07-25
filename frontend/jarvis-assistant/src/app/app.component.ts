import { Component } from '@angular/core';
import { VoiceCommandComponent } from "./components/voice-command/voice-command.component";
import { CaveComponent } from "./components/cave/cave.component";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    VoiceCommandComponent,
    CaveComponent,
    HttpClientModule,
    CommonModule
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jarvis-assistant';

// Ajout d'effet visuel ou autres comportements globaux

}