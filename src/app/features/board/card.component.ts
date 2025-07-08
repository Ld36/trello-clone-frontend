import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { Card } from '../../core/models';
import { CardService } from '../../core/services/card.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatChipsModule
  ],
  template: `
    <mat-card class="card-item" (click)="openCardDialog()">
      <mat-card-content>
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <button mat-icon-button 
                  class="card-menu-button"
                  [matMenuTriggerFor]="cardMenu"
                  (click)="$event.stopPropagation()">
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>

        <div class="card-description" *ngIf="card.description">
          {{ card.description }}
        </div>

        <div class="card-meta">
          <mat-chip *ngIf="card.label" 
                    [style.background-color]="card.labelColor || '#ccc'"
                    class="card-label">
            {{ card.label }}
          </mat-chip>
          
          <div class="card-due-date" *ngIf="card.dueDate">
            <mat-icon class="due-icon">schedule</mat-icon>
            <span [class.overdue]="isDueOverdue()" 
                  [class.due-soon]="isDueSoon()">
              {{ formatDueDate(card.dueDate) }}
            </span>
          </div>
        </div>

        <div class="card-status" *ngIf="card.isCompleted">
          <mat-icon class="completed-icon">check_circle</mat-icon>
          <span>Concluído</span>
        </div>
      </mat-card-content>

      <mat-menu #cardMenu="matMenu">
        <button mat-menu-item (click)="openCardDialog()">
          <mat-icon>edit</mat-icon>
          Editar
        </button>
        <button mat-menu-item (click)="toggleComplete()">
          <mat-icon>{{ card.isCompleted ? 'radio_button_unchecked' : 'check_circle' }}</mat-icon>
          {{ card.isCompleted ? 'Marcar como pendente' : 'Marcar como concluído' }}
        </button>
        <button mat-menu-item (click)="deleteCard()">
          <mat-icon>delete</mat-icon>
          Excluir
        </button>
      </mat-menu>
    </mat-card>
  `,
  styles: [`
    .card-item {
      margin-bottom: 8px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      background: white;
      border-radius: 8px;
      padding: 0;
    }

    .card-item:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .card-title {
      font-weight: 500;
      color: #172b4d;
      line-height: 1.4;
      word-wrap: break-word;
      flex: 1;
    }

    .card-menu-button {
      opacity: 0;
      transition: opacity 0.2s;
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      line-height: 24px;
    }

    .card-item:hover .card-menu-button {
      opacity: 1;
    }

    .card-description {
      color: #5e6c84;
      font-size: 12px;
      margin-bottom: 8px;
      line-height: 1.3;
    }

    .card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
    }

    .card-label {
      font-size: 10px;
      height: 20px;
      line-height: 20px;
      color: white;
      font-weight: 500;
    }

    .card-due-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #5e6c84;
    }

    .due-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
    }

    .overdue {
      color: #d32f2f !important;
      font-weight: 500;
    }

    .due-soon {
      color: #f57c00 !important;
      font-weight: 500;
    }

    .card-status {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #4caf50;
      font-size: 11px;
      font-weight: 500;
    }

    .completed-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
    }

    mat-card-content {
      padding: 8px 12px;
    }

    .cdk-drag-preview .card-item {
      transform: rotate(5deg);
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }
  `]
})
export class CardComponent {
  @Input() card!: Card;
  @Output() cardDeleted = new EventEmitter<string>();
  @Output() cardUpdated = new EventEmitter<Card>();

  constructor(
    private cardService: CardService,
    private dialog: MatDialog
  ) {}

  openCardDialog(): void {
    // Temporariamente usando alert até criar o CardDialogComponent
    alert('Funcionalidade de edição de card em desenvolvimento');
  }

  toggleComplete(): void {
    this.cardService.toggleComplete(this.card.id).subscribe({
      next: (updatedCard) => {
        this.cardUpdated.emit(updatedCard);
      },
      error: (error) => {
        console.error('Error toggling card completion:', error);
      }
    });
  }

  deleteCard(): void {
    if (confirm(`Tem certeza que deseja excluir o cartão "${this.card.title}"?`)) {
      this.cardService.deleteCard(this.card.id).subscribe({
        next: () => {
          this.cardDeleted.emit(this.card.id);
        },
        error: (error) => {
          console.error('Error deleting card:', error);
        }
      });
    }
  }

  isDueOverdue(): boolean {
    if (!this.card.dueDate) return false;
    const dueDate = new Date(this.card.dueDate);
    const now = new Date();
    return dueDate < now && !this.card.isCompleted;
  }

  isDueSoon(): boolean {
    if (!this.card.dueDate || this.card.isCompleted) return false;
    const dueDate = new Date(this.card.dueDate);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return dueDate <= tomorrow && dueDate >= now;
  }

  formatDueDate(dueDate: Date): string {
    const date = new Date(dueDate);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
