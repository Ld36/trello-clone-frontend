import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CardService } from '../../core/services/card.service';
import { Card, UpdateCardDto } from '../../core/models';

@Component({
  selector: 'app-card-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Editar Cartão</h2>
    
    <mat-dialog-content class="dialog-content">
      <form [formGroup]="cardForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" placeholder="Título do cartão">
          <mat-error *ngIf="cardForm.get('title')?.hasError('required')">
            Título é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput 
                    formControlName="description" 
                    placeholder="Adicione uma descrição detalhada..."
                    rows="4"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="label-field">
            <mat-label>Label</mat-label>
            <input matInput formControlName="label" placeholder="Nome da label">
          </mat-form-field>

          <mat-form-field appearance="outline" class="color-field">
            <mat-label>Cor da Label</mat-label>
            <mat-select formControlName="labelColor">
              <mat-option value="#f2d600">Amarelo</mat-option>
              <mat-option value="#ff9f1a">Laranja</mat-option>
              <mat-option value="#eb5a46">Vermelho</mat-option>
              <mat-option value="#c377e0">Roxo</mat-option>
              <mat-option value="#0079bf">Azul</mat-option>
              <mat-option value="#00c2e0">Azul Claro</mat-option>
              <mat-option value="#51e898">Verde</mat-option>
              <mat-option value="#61bd4f">Verde Escuro</mat-option>
              <mat-option value="#ff78cb">Rosa</mat-option>
              <mat-option value="#344563">Cinza</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data de Vencimento</mat-label>
          <input matInput 
                 [matDatepicker]="picker"
                 formControlName="dueDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-checkbox formControlName="isCompleted">
          Marcar como concluído
        </mat-checkbox>

        <div class="error-message" *ngIf="errorMessage()">
          {{ errorMessage() }}
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button 
              color="primary" 
              [disabled]="cardForm.invalid || isLoading()"
              (click)="onSubmit()">
        <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
        <span *ngIf="!isLoading()">Salvar</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      min-width: 500px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .label-field {
      flex: 2;
    }

    .color-field {
      flex: 1;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-top: 8px;
    }

    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    mat-spinner {
      margin-right: 8px;
    }

    mat-checkbox {
      margin-bottom: 16px;
    }
  `]
})
export class CardDialogComponent {
  cardForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private dialogRef: MatDialogRef<CardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Card
  ) {
    this.cardForm = this.fb.group({
      title: [data.title, [Validators.required]],
      description: [data.description || ''],
      label: [data.label || ''],
      labelColor: [data.labelColor || '#f2d600'],
      dueDate: [data.dueDate ? new Date(data.dueDate) : null],
      isCompleted: [data.isCompleted || false]
    });
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const updateData: UpdateCardDto = {
        ...this.cardForm.value,
        dueDate: this.cardForm.value.dueDate?.toISOString() || null
      };

      this.cardService.updateCard(this.data.id, updateData).subscribe({
        next: (updatedCard) => {
          this.isLoading.set(false);
          this.dialogRef.close(updatedCard);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Erro ao atualizar cartão');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
