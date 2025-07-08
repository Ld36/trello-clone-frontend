import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { LoginDto } from '../../core/models';

@Component({
  selector: 'app-login',
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Trello Clone</mat-card-title>
          <mat-card-subtitle>Entre em sua conta</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput 
                     type="email" 
                     formControlName="email"
                     placeholder="seu@email.com">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email é obrigatório
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Email inválido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput 
                     [type]="hidePassword() ? 'password' : 'text'"
                     formControlName="password"
                     placeholder="Sua senha">
              <button mat-icon-button 
                      matSuffix 
                      type="button"
                      (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{hidePassword() ? 'visibility' : 'visibility_off'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Senha é obrigatória
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage()">
              {{ errorMessage() }}
            </div>

            <div class="form-actions">
              <button mat-raised-button 
                      color="primary" 
                      type="submit"
                      [disabled]="loginForm.invalid || isLoading()"
                      class="full-width">
                <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
                <span *ngIf="!isLoading()">Entrar</span>
              </button>
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-actions>
          <p>Não tem uma conta? <a routerLink="/auth/register">Registre-se</a></p>
          <p><a routerLink="/auth/forgot-password">Esqueci minha senha</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      margin-top: 20px;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 20px;
    }

    mat-card-actions {
      text-align: center;
      margin-top: 20px;
    }

    mat-card-actions a {
      color: #667eea;
      text-decoration: none;
    }

    mat-card-actions a:hover {
      text-decoration: underline;
    }

    mat-spinner {
      margin-right: 10px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      const loginData: LoginDto = this.loginForm.value;
      
      this.authService.login(loginData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Erro ao fazer login');
        }
      });
    }
  }
}
