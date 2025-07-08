import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ListService } from '../../core/services/list.service';
import { CardService } from '../../core/services/card.service';
import { List, Card } from '../../core/models';
import { CardComponent } from './card.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    DragDropModule,
    CardComponent
  ],
  template: `
    <mat-card class="list-card">
      <mat-card-header class="list-header">
        <mat-card-title class="list-title">
          <span [class.editing]="isEditing" 
                (click)="startEditing()"
                *ngIf="!isEditing">
            {{ list.title }}
          </span>
          <input #titleInput
                 *ngIf="isEditing"
                 [(ngModel)]="editingTitle"
                 (blur)="saveTitle()"
                 (keyup.enter)="saveTitle()"
                 (keyup.escape)="cancelEditing()"
                 class="title-input">
        </mat-card-title>
        <button mat-icon-button [matMenuTriggerFor]="listMenu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #listMenu="matMenu">
          <button mat-menu-item (click)="startEditing()">
            <mat-icon>edit</mat-icon>
            Editar
          </button>
          <button mat-menu-item (click)="deleteList()">
            <mat-icon>delete</mat-icon>
            Excluir
          </button>
        </mat-menu>
      </mat-card-header>

      <mat-card-content class="list-content">
        <div class="cards-container"
             cdkDropList
             [cdkDropListData]="cards()"
             [cdkDropListConnectedTo]="getConnectedLists()"
             (cdkDropListDropped)="onCardDrop($event)">
          
          <div *ngFor="let card of cards(); trackBy: trackByCardId"
               cdkDrag>
            <app-card 
              [card]="card"
              (cardDeleted)="onCardDeleted($event)"
              (cardUpdated)="onCardUpdated($event)">
            </app-card>
          </div>

          <div class="add-card-container" *ngIf="!isAddingCard">
            <button mat-stroked-button 
                    class="add-card-button"
                    (click)="startAddingCard()">
              <mat-icon>add</mat-icon>
              Adicionar cartão
            </button>
          </div>

          <div class="add-card-form" *ngIf="isAddingCard">
            <textarea #cardTitleInput
                      [(ngModel)]="newCardTitle"
                      placeholder="Insira um título para este cartão..."
                      class="card-title-input"
                      (keyup.enter)="addCard()"
                      (keyup.escape)="cancelAddingCard()"></textarea>
            <div class="add-card-actions">
              <button mat-raised-button 
                      color="primary"
                      [disabled]="!newCardTitle.trim()"
                      (click)="addCard()">
                Adicionar cartão
              </button>
              <button mat-icon-button (click)="cancelAddingCard()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .list-card {
      width: 300px;
      background-color: #f1f2f4;
      margin: 0;
    }

    .list-header {
      background-color: transparent;
      padding: 8px 16px;
      margin-bottom: 0;
    }

    .list-title {
      flex: 1;
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #172b4d;
    }

    .list-title span {
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      display: block;
    }

    .list-title span:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .title-input {
      width: 100%;
      border: 2px solid #0079bf;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 16px;
      font-weight: 600;
      background: white;
      outline: none;
    }

    .list-content {
      padding: 0 8px 8px;
    }

    .cards-container {
      min-height: 40px;
    }

    .add-card-container {
      margin-top: 8px;
    }

    .add-card-button {
      width: 100%;
      justify-content: flex-start;
      color: #5e6c84;
      border: none;
      background: transparent;
    }

    .add-card-button:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .add-card-form {
      margin-top: 8px;
    }

    .card-title-input {
      width: 100%;
      min-height: 60px;
      border: 2px solid #0079bf;
      border-radius: 4px;
      padding: 8px;
      font-size: 14px;
      resize: vertical;
      outline: none;
      margin-bottom: 8px;
    }

    .add-card-actions {
      display: flex;
      align-items: center;
      gap: 8px;
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

    .cards-container.cdk-drop-list-dragging .card-item:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class ListComponent implements OnInit {
  @Input() list!: List;
  @Input() boardId!: string;
  @Output() listDeleted = new EventEmitter<string>();
  @Output() listUpdated = new EventEmitter<List>();

  cards = signal<Card[]>([]);
  isEditing = false;
  editingTitle = '';
  isAddingCard = false;
  newCardTitle = '';

  constructor(
    private listService: ListService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.cardService.getCardsByList(this.list.id).subscribe({
      next: (cards) => {
        this.cards.set(cards.sort((a, b) => a.position - b.position));
      },
      error: (error) => {
        console.error('Error loading cards:', error);
      }
    });
  }

  startEditing(): void {
    this.isEditing = true;
    this.editingTitle = this.list.title;
  }

  saveTitle(): void {
    if (this.editingTitle.trim() && this.editingTitle !== this.list.title) {
      this.listService.updateList(this.list.id, { title: this.editingTitle.trim() }).subscribe({
        next: (updatedList) => {
          this.list.title = updatedList.title;
          this.listUpdated.emit(updatedList);
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error updating list:', error);
          this.isEditing = false;
        }
      });
    } else {
      this.isEditing = false;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editingTitle = '';
  }

  deleteList(): void {
    if (confirm(`Tem certeza que deseja excluir a lista "${this.list.title}"?`)) {
      this.listService.deleteList(this.list.id).subscribe({
        next: () => {
          this.listDeleted.emit(this.list.id);
        },
        error: (error) => {
          console.error('Error deleting list:', error);
        }
      });
    }
  }

  startAddingCard(): void {
    this.isAddingCard = true;
    this.newCardTitle = '';
  }

  addCard(): void {
    if (this.newCardTitle.trim()) {
      const newCard = {
        title: this.newCardTitle.trim(),
        listId: this.list.id,
        position: this.cards().length
      };

      this.cardService.createCard(newCard).subscribe({
        next: () => {
          this.loadCards();
          this.cancelAddingCard();
        },
        error: (error) => {
          console.error('Error creating card:', error);
        }
      });
    }
  }

  cancelAddingCard(): void {
    this.isAddingCard = false;
    this.newCardTitle = '';
  }

  onCardDrop(event: CdkDragDrop<Card[]>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same list
      const cards = [...this.cards()];
      moveItemInArray(cards, event.previousIndex, event.currentIndex);
      
      const reorderData = cards.map((card, index) => ({
        cardId: card.id,
        newPosition: index
      }));

      this.cardService.reorderCards(this.list.id, reorderData).subscribe({
        next: () => {
          this.cards.set(cards);
        },
        error: (error) => {
          console.error('Error reordering cards:', error);
          this.loadCards();
        }
      });
    } else {
      // Moving to a different list
      const card = event.previousContainer.data[event.previousIndex];
      const moveData = {
        cardId: card.id,
        targetListId: this.list.id,
        newPosition: event.currentIndex
      };

      this.cardService.moveCard(card.id, moveData).subscribe({
        next: () => {
          // Remove from source list
          const sourceCards = [...event.previousContainer.data];
          sourceCards.splice(event.previousIndex, 1);
          
          // Add to target list
          const targetCards = [...this.cards()];
          targetCards.splice(event.currentIndex, 0, card);
          
          this.cards.set(targetCards);
        },
        error: (error) => {
          console.error('Error moving card:', error);
          this.loadCards();
        }
      });
    }
  }

  onCardDeleted(cardId: string): void {
    this.loadCards();
  }

  onCardUpdated(card: Card): void {
    const currentCards = this.cards();
    const updatedCards = currentCards.map(c => c.id === card.id ? card : c);
    this.cards.set(updatedCards);
  }

  getConnectedLists(): string[] {
    // This would need to be provided by the parent component
    return [];
  }

  trackByCardId(index: number, card: Card): string {
    return card.id;
  }
}
