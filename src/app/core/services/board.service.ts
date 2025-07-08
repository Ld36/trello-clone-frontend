import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Board, CreateBoardDto, UpdateBoardDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createBoard(board: CreateBoardDto): Observable<Board> {
    return this.http.post<Board>(`${this.baseUrl}/boards`, board);
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.baseUrl}/boards`);
  }

  getMyBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.baseUrl}/boards/my-boards`);
  }

  getBoardById(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.baseUrl}/boards/${id}`);
  }

  updateBoard(id: string, board: UpdateBoardDto): Observable<Board> {
    return this.http.patch<Board>(`${this.baseUrl}/boards/${id}`, board);
  }

  deleteBoard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/boards/${id}`);
  }
}
