import { Component } from '@angular/core';
import { VoiceCommandComponent } from "./components/voice-command/voice-command.component";
import { RouterOutlet } from "../../node_modules/@angular/router/index";
import { CaveComponent } from "./components/cave/cave.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    VoiceCommandComponent,
    RouterOutlet,
    CaveComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jarvis-assistant';

// Ajout d'effet visuel ou autres comportements globaux

}