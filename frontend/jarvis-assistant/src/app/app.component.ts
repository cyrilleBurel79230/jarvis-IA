import { Component } from '@angular/core';
import { AssistantComponent } from './assistant/assistant.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ AssistantComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jarvis-assistant';
}