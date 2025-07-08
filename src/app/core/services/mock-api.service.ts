import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { User, LoginDto, RegisterDto, AuthResponse, Board, CreateBoardDto, List, CreateListDto, Card, CreateCardDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private boards: Board[] = [
    {
      id: '1',
      title: 'Projeto Exemplo',
      description: 'Descrição do projeto exemplo',
      backgroundColor: '#0079bf',
      isPublic: true,
      ownerId: '1',
      lists: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private lists: List[] = [
    {
      id: '1',
      title: 'To Do',
      position: 0,
      boardId: '1',
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'In Progress',
      position: 1,
      boardId: '1',
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Done',
      position: 2,
      boardId: '1',
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private cards: Card[] = [
    {
      id: '1',
      title: 'Tarefa de exemplo',
      description: 'Descrição da tarefa',
      position: 0,
      listId: '1',
      label: 'Feature',
      labelColor: '#61bd4f',
      dueDate: new Date(),
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private currentUser: User | null = null;
  private token = 'mock-jwt-token';

  // Auth Methods
  login(credentials: LoginDto): Observable<AuthResponse> {
    const user = this.users.find(u => u.email === credentials.email);
    
    if (user && credentials.password === '123456') {
      this.currentUser = user;
      return of({
        access_token: this.token,
        user: user
      }).pipe(delay(500));
    }
    
    return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
  }

  register(userData: RegisterDto): Observable<AuthResponse> {
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email: userData.email,
      name: userData.name,
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    this.currentUser = newUser;
    
    return of({
      access_token: this.token,
      user: newUser
    }).pipe(delay(500));
  }

  getCurrentUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser).pipe(delay(300));
    }
    return throwError(() => new Error('Not authenticated')).pipe(delay(300));
  }

  // Board Methods
  getBoards(): Observable<Board[]> {
    return of(this.boards).pipe(delay(500));
  }

  getBoardById(id: string): Observable<Board> {
    const board = this.boards.find(b => b.id === id);
    if (board) {
      const boardWithLists = {
        ...board,
        lists: this.lists.filter(l => l.boardId === id).map(list => ({
          ...list,
          cards: this.cards.filter(c => c.listId === list.id)
        }))
      };
      return of(boardWithLists).pipe(delay(500));
    }
    return throwError(() => new Error('Board not found')).pipe(delay(500));
  }

  createBoard(boardData: CreateBoardDto): Observable<Board> {
    const newBoard: Board = {
      id: (this.boards.length + 1).toString(),
      ...boardData,
      ownerId: this.currentUser?.id || '1',
      lists: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.boards.push(newBoard);
    return of(newBoard).pipe(delay(500));
  }

  // List Methods
  getListsByBoard(boardId: string): Observable<List[]> {
    const lists = this.lists.filter(l => l.boardId === boardId);
    return of(lists).pipe(delay(300));
  }

  createList(listData: CreateListDto): Observable<List> {
    const newList: List = {
      id: (this.lists.length + 1).toString(),
      ...listData,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.lists.push(newList);
    return of(newList).pipe(delay(500));
  }

  // Card Methods
  getCardsByList(listId: string): Observable<Card[]> {
    const cards = this.cards.filter(c => c.listId === listId);
    return of(cards).pipe(delay(300));
  }

  createCard(cardData: CreateCardDto): Observable<Card> {
    const newCard: Card = {
      id: (this.cards.length + 1).toString(),
      ...cardData,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.cards.push(newCard);
    return of(newCard).pipe(delay(500));
  }

  // Helper Methods
  isUsingMockApi(): boolean {
    return true;
  }

  // Password Methods
  forgotPassword(email: { email: string }): Observable<any> {
    return of({ message: 'Password reset email sent' }).pipe(delay(500));
  }

  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return of({ message: 'Password reset successful' }).pipe(delay(500));
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return of({ message: 'Password changed successfully' }).pipe(delay(500));
  }
}
