import { Component } from '@angular/core';
import { AssistantComponent } from './assistant/assistant.component';
import { AudioUploadComponent } from './components/audio-upload/audio-upload.component'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ 
    AssistantComponent,
    AudioUploadComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jarvis-assistant';
}