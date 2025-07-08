import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../core/services/auth.service';
import { BoardService } from '../../core/services/board.service';
import { Board, User } from '../../core/models';
import { CreateBoardDialogComponent } from './create-board-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary">
        <span>Trello Clone</span>
        <span class="spacer"></span>
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ currentUser()?.name }}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            Perfil
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Sair
          </button>
        </mat-menu>
      </mat-toolbar>

      <div class="dashboard-content">
        <div class="dashboard-header">
          <h1>Meus Quadros</h1>
          <button mat-raised-button color="primary" (click)="openCreateBoardDialog()">
            <mat-icon>add</mat-icon>
            Novo Quadro
          </button>
        </div>

        <div class="boards-loading" *ngIf="isLoading()">
          <mat-spinner></mat-spinner>
        </div>

        <div class="boards-grid" *ngIf="!isLoading()">
          <mat-grid-list cols="4" rowHeight="200px" gutterSize="16px">
            <mat-grid-tile *ngFor="let board of boards()">
              <mat-card class="board-card" 
                        [style.background-color]="board.backgroundColor || '#0079bf'"
                        [routerLink]="['/board', board.id]">
                <mat-card-header>
                  <mat-card-title class="board-title">{{ board.title }}</mat-card-title>
                  <mat-card-subtitle class="board-subtitle" 
                                     *ngIf="board.description">
                    {{ board.description }}
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-icon-button 
                          (click)="editBoard(board, $event)"
                          class="edit-button">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button 
                          (click)="deleteBoard(board, $event)"
                          class="delete-button">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </mat-grid-tile>
          </mat-grid-list>
        </div>

        <div class="empty-state" *ngIf="!isLoading() && boards().length === 0">
          <mat-icon class="empty-icon">dashboard</mat-icon>
          <h2>Nenhum quadro encontrado</h2>
          <p>Crie seu primeiro quadro para começar a organizar suas tarefas</p>
          <button mat-raised-button color="primary" (click)="openCreateBoardDialog()">
            <mat-icon>add</mat-icon>
            Criar Quadro
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .dashboard-content {
      padding: 24px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #333;
    }

    .boards-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .boards-grid {
      width: 100%;
    }

    .board-card {
      width: 100%;
      height: 100%;
      cursor: pointer;
      transition: transform 0.2s;
      position: relative;
      color: white;
    }

    .board-card:hover {
      transform: translateY(-2px);
    }

    .board-title {
      color: white;
      font-weight: 600;
    }

    .board-subtitle {
      color: rgba(255, 255, 255, 0.8);
    }

    .board-card mat-card-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .board-card:hover mat-card-actions {
      opacity: 1;
    }

    .edit-button, .delete-button {
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      color: #ccc;
    }

    .empty-state h2 {
      margin-bottom: 8px;
    }

    .empty-state p {
      margin-bottom: 24px;
    }

    @media (max-width: 768px) {
      .boards-grid mat-grid-list {
        cols: 1;
      }
    }

    @media (max-width: 1024px) {
      .boards-grid mat-grid-list {
        cols: 2;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  boards = signal<Board[]>([]);
  currentUser = signal<User | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private boardService: BoardService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBoards();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  loadBoards(): void {
    this.isLoading.set(true);
    this.boardService.getMyBoards().subscribe({
      next: (boards) => {
        this.boards.set(boards);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading boards:', error);
        this.isLoading.set(false);
      }
    });
  }

  openCreateBoardDialog(): void {
    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBoards();
      }
    });
  }

  editBoard(board: Board, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '400px',
      data: board
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBoards();
      }
    });
  }

  deleteBoard(board: Board, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm(`Tem certeza que deseja excluir o quadro "${board.title}"?`)) {
      this.boardService.deleteBoard(board.id).subscribe({
        next: () => {
          this.loadBoards();
        },
        error: (error) => {
          console.error('Error deleting board:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
