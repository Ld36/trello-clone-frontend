import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from '../../core/services/board.service';
import { ListService } from '../../core/services/list.service';
import { CardService } from '../../core/services/card.service';
import { Board, List, Card } from '../../core/models';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    DragDropModule
  ],
  template: `
    <div class="board-container" [style.background-color]="board()?.backgroundColor || '#0079bf'">
      <mat-toolbar class="board-toolbar">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span class="board-title">{{ board()?.title }}</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="addList()">
          <mat-icon>add</mat-icon>
          Adicionar Lista
        </button>
      </mat-toolbar>

      <div class="board-content">
        <div class="loading-container" *ngIf="isLoading()">
          <mat-spinner></mat-spinner>
        </div>

        <div class="lists-container" 
             cdkDropList 
             cdkDropListOrientation="horizontal"
             [cdkDropListData]="lists()"
             (cdkDropListDropped)="onListDrop($event)"
             *ngIf="!isLoading()">
          
          <div class="list-wrapper" 
               *ngFor="let list of lists(); trackBy: trackByListId"
               cdkDrag>
            <mat-card class="list-card">
              <mat-card-header>
                <mat-card-title>{{ list.title }}</mat-card-title>
                <button mat-icon-button (click)="deleteList(list.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-card-header>
              <mat-card-content>
                <p>Lista: {{ list.title }}</p>
                <button mat-button (click)="addCard(list.id)">
                  <mat-icon>add</mat-icon>
                  Adicionar Card
                </button>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="add-list-placeholder" *ngIf="lists().length === 0">
            <mat-card class="add-list-card">
              <mat-card-content>
                <div class="empty-state">
                  <mat-icon class="empty-icon">view_list</mat-icon>
                  <h3>Nenhuma lista encontrada</h3>
                  <p>Adicione sua primeira lista para começar a organizar as tarefas</p>
                  <button mat-raised-button color="primary" (click)="addList()">
                    <mat-icon>add</mat-icon>
                    Adicionar Lista
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .board-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .board-toolbar {
      background: rgba(0, 0, 0, 0.2);
      color: white;
    }

    .board-title {
      font-size: 18px;
      font-weight: 600;
      margin-left: 16px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .board-content {
      flex: 1;
      padding: 16px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .lists-container {
      display: flex;
      gap: 16px;
      min-height: 400px;
      overflow-x: auto;
      padding-bottom: 16px;
    }

    .list-wrapper {
      flex: 0 0 300px;
      min-width: 300px;
    }

    .add-list-placeholder {
      flex: 0 0 300px;
      min-width: 300px;
    }

    .add-list-card {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
    }

    .empty-state {
      text-align: center;
      color: #666;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #ccc;
    }

    .empty-state h3 {
      margin-bottom: 8px;
    }

    .empty-state p {
      margin-bottom: 16px;
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .lists-container.cdk-drop-list-dragging .list-wrapper:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .list-card {
      min-height: 200px;
      background: rgba(255, 255, 255, 0.95);
      margin-bottom: 16px;
    }

    .list-card mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .list-card mat-card-title {
      font-size: 16px;
      font-weight: 600;
      flex: 1;
    }

    .list-card mat-card-content {
      padding: 16px;
    }
  `]
})
export class BoardViewComponent implements OnInit {
  boardId: string = '';
  board = signal<Board | null>(null);
  lists = signal<List[]>([]);
  isLoading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private listService: ListService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.boardId = params['id'];
      this.loadBoard();
      this.loadLists();
    });
  }

  loadBoard(): void {
    this.boardService.getBoardById(this.boardId).subscribe({
      next: (board) => {
        this.board.set(board);
      },
      error: (error) => {
        console.error('Error loading board:', error);
      }
    });
  }

  loadLists(): void {
    this.isLoading.set(true);
    this.listService.getListsByBoard(this.boardId).subscribe({
      next: (lists) => {
        this.lists.set(lists.sort((a, b) => a.position - b.position));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading lists:', error);
        this.isLoading.set(false);
      }
    });
  }

  addList(): void {
    const title = prompt('Nome da lista:');
    if (title) {
      const newList = {
        title,
        boardId: this.boardId,
        position: this.lists().length
      };

      this.listService.createList(newList).subscribe({
        next: () => {
          this.loadLists();
        },
        error: (error) => {
          console.error('Error creating list:', error);
        }
      });
    }
  }

  onListDrop(event: CdkDragDrop<List[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      const lists = [...this.lists()];
      moveItemInArray(lists, event.previousIndex, event.currentIndex);
      
      // Update positions
      const reorderData = lists.map((list, index) => ({
        listId: list.id,
        newPosition: index
      }));

      this.listService.reorderLists(this.boardId, reorderData).subscribe({
        next: () => {
          this.lists.set(lists);
        },
        error: (error) => {
          console.error('Error reordering lists:', error);
          // Revert changes on error
          this.loadLists();
        }
      });
    }
  }

  deleteList(listId: string): void {
    if (confirm('Tem certeza que deseja excluir esta lista?')) {
      this.listService.deleteList(listId).subscribe({
        next: () => {
          this.loadLists();
        },
        error: (error) => {
          console.error('Error deleting list:', error);
        }
      });
    }
  }

  addCard(listId: string): void {
    const title = prompt('Título do card:');
    if (title) {
      const newCard = {
        title,
        listId,
        position: 0 // Simplified for now
      };

      this.cardService.createCard(newCard).subscribe({
        next: () => {
          this.loadLists();
        },
        error: (error) => {
          console.error('Error creating card:', error);
        }
      });
    }
  }

  onListDeleted(listId: string): void {
    this.loadLists();
  }

  onListUpdated(list: List): void {
    const currentLists = this.lists();
    const updatedLists = currentLists.map(l => l.id === list.id ? list : l);
    this.lists.set(updatedLists);
  }

  trackByListId(index: number, list: List): string {
    return list.id;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
