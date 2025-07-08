import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { List, CreateListDto, UpdateListDto, ReorderListDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createList(list: CreateListDto): Observable<List> {
    return this.http.post<List>(`${this.baseUrl}/lists`, list);
  }

  getListsByBoard(boardId: string): Observable<List[]> {
    return this.http.get<List[]>(`${this.baseUrl}/lists/board/${boardId}`);
  }

  getListById(id: string): Observable<List> {
    return this.http.get<List>(`${this.baseUrl}/lists/${id}`);
  }

  updateList(id: string, list: UpdateListDto): Observable<List> {
    return this.http.patch<List>(`${this.baseUrl}/lists/${id}`, list);
  }

  deleteList(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/lists/${id}`);
  }

  reorderLists(boardId: string, reorderData: ReorderListDto[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/lists/board/${boardId}/reorder`, reorderData);
  }
}
