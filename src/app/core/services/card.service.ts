import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, CreateCardDto, UpdateCardDto, MoveCardDto, ReorderCardDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createCard(card: CreateCardDto): Observable<Card> {
    return this.http.post<Card>(`${this.baseUrl}/cards`, card);
  }

  getCardsByList(listId: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.baseUrl}/cards/list/${listId}`);
  }

  getCardById(id: string): Observable<Card> {
    return this.http.get<Card>(`${this.baseUrl}/cards/${id}`);
  }

  updateCard(id: string, card: UpdateCardDto): Observable<Card> {
    return this.http.patch<Card>(`${this.baseUrl}/cards/${id}`, card);
  }

  deleteCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cards/${id}`);
  }

  moveCard(id: string, moveData: MoveCardDto): Observable<Card> {
    return this.http.post<Card>(`${this.baseUrl}/cards/${id}/move`, moveData);
  }

  reorderCards(listId: string, reorderData: ReorderCardDto[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/cards/list/${listId}/reorder`, reorderData);
  }

  toggleComplete(id: string): Observable<Card> {
    return this.http.post<Card>(`${this.baseUrl}/cards/${id}/toggle-complete`, {});
  }
}
