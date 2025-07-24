import { Component } from '@angular/core';
import { VoiceCommandComponent } from "./components/voice-command/voice-command.component";
import { RouterOutlet } from "../../node_modules/@angular/router/index";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    VoiceCommandComponent,
    RouterOutlet
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jarvis-assistant';

// Ajout d'effet visuel ou autres comportements globaux

}