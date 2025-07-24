import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BottleUpdatePayload {
  id: string;
  temperature?: number;
  status?: 'mature' | 'stock' | 'alert';
  location?: string;
}

@Injectable({ providedIn: 'root' })
export class CaveService {
  private apiUrl = 'https://deepsite-backend.com/api/cave'; // modifie selon ton backend

  constructor(private http: HttpClient) {}

  // 🔹 Lecture : récupère toutes les bouteilles
  getAllBottles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bottles`);
  }

  // 🔹 Lecture : stats globales (total, mature, alertes...)
  getWineStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  // 🔸 Mise à jour d'une bouteille
  updateBottle(payload: BottleUpdatePayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/bottle/${payload.id}`, payload);
  }

  // 🔸 Ajout d'une nouvelle bouteille
  addBottle(payload: BottleUpdatePayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/bottle`, payload);
  }

  // 🔸 Suppression d'une bouteille
  deleteBottle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bottle/${id}`);
  }
  // Résumé pour Dashboard
  getDashboardSummary(): Observable<Record<string, string>> {
    return this.getCaveData().pipe(
      map(data =>
        const rows = data.values || [];
        const matureCount = rows.filter(row => row[2]  === 'mature').length;
        return `Nombre de bouteilles arrivées à maturité : ${matureCount}`;
      })
    );
  } 
  
}