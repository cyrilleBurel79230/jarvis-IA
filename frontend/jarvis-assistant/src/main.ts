import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AssistantComponent } from './app/assistant/assistant.component';

bootstrapApplication(AssistantComponent, {
  providers: [provideHttpClient()]
}).catch(err => console.error(err));