import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth routes
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent) },
      { path: 'forgot-password', loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
      { path: 'registration-success', loadComponent: () => import('./features/auth/pages/registration-success/registration-success.component').then(m => m.RegistrationSuccessComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Email verification route (matches backend pattern)
  {
    path: 'activate/:token',
    loadComponent: () => import('./features/auth/pages/email-verification/email-verification.component').then(m => m.EmailVerificationComponent)
  },

  // Backend activation route (matches the email link)
  {
    path: 'api/auth/activate/:token',
    loadComponent: () => import('./features/auth/pages/email-verification/email-verification.component').then(m => m.EmailVerificationComponent)
  },

  // Reset password route (matches backend pattern)
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./features/auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

  // Token handler for backend links (handles both activation and reset)
  {
    path: 'auth/reset-password/:token',
    loadComponent: () => import('./features/auth/pages/token-handler/token-handler.component').then(m => m.TokenHandlerComponent)
  },

  // Protected routes
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },

  // Account activated route
  {
    path: 'account-activated',
    loadComponent: () => import('./features/auth/pages/account-activated/account-activated.component').then(m => m.AccountActivatedComponent)
  },

  // Reset password result route
  {
    path: 'reset-password-result',
    loadComponent: () => import('./features/auth/pages/reset-password-result/reset-password-result.component').then(m => m.ResetPasswordResultComponent)
  },

  // Default redirects
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
