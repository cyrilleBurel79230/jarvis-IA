import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BottleUpdatePayload {
  id: string;
  temperature?: number;
  status?: 'mature' | 'stock' | 'alert';
  location?: string;
}

@Injectable({ providedIn: 'root' })
export class CaveService {
  private apiUrl = 'http://localhost:3000/api/cave'; // modifie selon ton backend

  constructor(private http: HttpClient) {}

  // 🔹 Lecture : récupère toutes les bouteilles
  getAllBottles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bottles`);
  }

  // 🔹 Lecture : stats globales (total, mature, alertes...)
  getWineStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  // 🔸 Lecture : une bouteille par ID
  getBottleById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bottle/${id}`);
  }

  // 🔸 Ajout d'une nouvelle bouteille
  addBottle(payload: BottleUpdatePayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/bottle`, payload);
  }

  // 🔸 Mise à jour d'une bouteille
  updateBottle(payload: BottleUpdatePayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/bottle/${payload.id}`, payload);
  }

  // 🔸 Suppression d'une bouteille
  deleteBottle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bottle/${id}`);
  }

  // 🔸 Résumé pour Dashboard
  getDashboardSummary(): Observable<{ summary: string }> {
    return this.getAllBottles().pipe(
      map(rows => {
        const matureCount = rows.filter(bottle => bottle.status === 'mature').length;
        return { summary: `Nombre de bouteilles arrivées à maturité : ${matureCount}` };
      })
    );
  }
getStats() {
  return this.http.get<{ totalZones: number; totalBottles: number }>('/api/cave/stats');
}


}