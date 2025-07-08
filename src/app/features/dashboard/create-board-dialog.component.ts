import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BoardService } from '../../core/services/board.service';
import { Board, CreateBoardDto, UpdateBoardDto } from '../../core/models';

@Component({
  selector: 'app-create-board-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar Quadro' : 'Criar Novo Quadro' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="boardForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" placeholder="Nome do quadro">
          <mat-error *ngIf="boardForm.get('title')?.hasError('required')">
            Título é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput 
                    formControlName="description" 
                    placeholder="Descrição do quadro (opcional)"
                    rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cor de Fundo</mat-label>
          <input matInput 
                 type="color" 
                 formControlName="backgroundColor">
        </mat-form-field>

        <mat-checkbox formControlName="isPublic">
          Quadro público
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
              [disabled]="boardForm.invalid || isLoading()"
              (click)="onSubmit()">
        <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
        <span *ngIf="!isLoading()">{{ isEdit ? 'Atualizar' : 'Criar' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
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
  `]
})
export class CreateBoardDialogComponent {
  boardForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService,
    private dialogRef: MatDialogRef<CreateBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Board | null
  ) {
    this.isEdit = !!data;
    
    this.boardForm = this.fb.group({
      title: [data?.title || '', [Validators.required]],
      description: [data?.description || ''],
      backgroundColor: [data?.backgroundColor || '#0079bf'],
      isPublic: [data?.isPublic || false]
    });
  }

  onSubmit(): void {
    if (this.boardForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      if (this.isEdit && this.data) {
        const updateData: UpdateBoardDto = this.boardForm.value;
        this.boardService.updateBoard(this.data.id, updateData).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(error.error?.message || 'Erro ao atualizar quadro');
          }
        });
      } else {
        const createData: CreateBoardDto = this.boardForm.value;
        this.boardService.createBoard(createData).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(error.error?.message || 'Erro ao criar quadro');
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
