import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GardenService {

  private apiUrl = 'https://deepsite-backend.com/api/garden'; // modifie selon ton backend

  constructor(private http: HttpClient) {}
  // Résumé pour Dashboard
  getDashboardSummary(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${this.apiUrl}/dashboard-summary`);
  } 
  
}
