import { Routes } from '@angular/router';
import { CaveComponent } from './components/cave/cave.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CaveMapComponent } from './components/cave/cave-map/cave-map.component';

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
    path: '**',
    redirectTo: 'dashboard'
  }
];