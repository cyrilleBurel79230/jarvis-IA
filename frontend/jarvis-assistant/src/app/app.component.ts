import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AssistantComponent } from './assistant/assistant.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AssistantComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jarvis-assistant';
}