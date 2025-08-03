import { Routes } from '@angular/router';
import { CaveComponent } from './components/cave/cave.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CaveMapComponent } from './components/cave/cave-map/cave-map.component';
import { CameraOcrComponent } from './components/camera-ocr/camera-ocr.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'cave',
    component: CaveComponent
  },
  {
    path: 'cave-map',
    component: CaveMapComponent
  },
  {
    path:'scanner',
    component: CameraOcrComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];