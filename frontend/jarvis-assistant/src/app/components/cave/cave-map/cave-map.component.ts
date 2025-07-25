import { Component } from '@angular/core';

@Component({
  selector: 'app-cave-map',
  standalone: true,
  templateUrl: './cave-map.component.html',
  styleUrls: ['./cave-map.component.scss']  // <- tableau et pluriel
})
export class CaveMapComponent {
  selectedZone: any;
  jarvis: any;
 }
