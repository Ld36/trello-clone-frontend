import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { User, ChangePasswordDto } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <button mat-icon-button routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Perfil</h1>
      </div>

      <div class="profile-content">
        <mat-card class="profile-card">
          <mat-card-header>
            <mat-card-title>Informações Pessoais</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="user-info" *ngIf="currentUser()">
              <div class="info-item">
                <strong>Nome:</strong> {{ currentUser()?.name }}
              </div>
              <div class="info-item">
                <strong>Email:</strong> {{ currentUser()?.email }}
              </div>
              <div class="info-item">
                <strong>Membro desde:</strong> {{ formatDate(currentUser()?.createdAt) }}
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="password-card">
          <mat-card-header>
            <mat-card-title>Alterar Senha</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Senha Atual</mat-label>
                <input matInput 
                       type="password" 
                       formControlName="currentPassword"
                       placeholder="Digite sua senha atual">
                <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                  Senha atual é obrigatória
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nova Senha</mat-label>
                <input matInput 
                       type="password" 
                       formControlName="newPassword"
                       placeholder="Digite sua nova senha">
                <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                  Nova senha é obrigatória
                </mat-error>
                <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                  Nova senha deve ter pelo menos 6 caracteres
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Confirmar Nova Senha</mat-label>
                <input matInput 
                       type="password" 
                       formControlName="confirmPassword"
                       placeholder="Confirme sua nova senha">
                <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                  Confirmação de senha é obrigatória
                </mat-error>
                <mat-error *ngIf="passwordForm.hasError('passwordMismatch')">
                  Senhas não coincidem
                </mat-error>
              </mat-form-field>

              <div class="success-message" *ngIf="successMessage()">
                {{ successMessage() }}
              </div>

              <div class="error-message" *ngIf="errorMessage()">
                {{ errorMessage() }}
              </div>

              <div class="form-actions">
                <button mat-raised-button 
                        color="primary" 
                        type="submit"
                        [disabled]="passwordForm.invalid || isLoading()">
                  <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
                  <span *ngIf="!isLoading()">Alterar Senha</span>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }

    .profile-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
    }

    .profile-header h1 {
      margin: 0 0 0 16px;
      color: #333;
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .profile-card, .password-card {
      width: 100%;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-item {
      font-size: 16px;
      color: #333;
    }

    .info-item strong {
      color: #666;
      margin-right: 8px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      margin-top: 20px;
    }

    .success-message {
      color: #4caf50;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    mat-spinner {
      margin-right: 10px;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 16px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser = signal<User | null>(null);
  passwordForm: FormGroup;
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading.set(true);
      this.successMessage.set('');
      this.errorMessage.set('');
      
      const changePasswordData: ChangePasswordDto = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };
      
      this.authService.changePassword(changePasswordData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successMessage.set('Senha alterada com sucesso!');
          this.passwordForm.reset();
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Erro ao alterar senha');
        }
      });
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
