import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private readonly STORAGE_KEY = 'users';
  private readonly CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  private readonly SENDGRID_API = 'https://api.sendgrid.com/v3/mail/send';

  constructor(private http: HttpClient) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.initializeUsers();
  }

  private initializeUsers() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const defaultUsers: User[] = [
        {
          id: 1,
          username: 'admin',
          password: 'admin123',
          name: 'Administrador',
          email: 'ped.torres@duocuc.cl',
          role: 'admin'
        },
        {
          id: 2,
          username: 'user',
          password: 'user123',
          name: 'Usuario Normal',
          email: 'ped.torres@duocuc.cl',
          role: 'user'
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  login(username: string, password: string): Observable<any> {
    const users = this.getUsers();
    const user = users.find(u => 
      u.username === username && u.password === password
    );

    if (user) {
      return of({ success: true, user }).pipe(
        delay(1000),
        map(response => {
          this.isLoggedIn = true;
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(user));
          return response;
        })
      );
    } else {
      return throwError(() => new Error('Usuario o contraseña incorrectos'));
    }
  }

  resetPassword(username: string, email: string, newPassword: string): Observable<any> {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => 
      u.username === username && u.email === email
    );

    if (userIndex === -1) {
      return throwError(() => new Error('Usuario no encontrado'));
    }

    // Actualizar la contraseña
    users[userIndex].password = newPassword;
    this.saveUsers(users);

    // Configuración headers con proxy CORS
    const headers = {
      'Authorization': `Bearer ${environment.sendgridApiKey}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    const emailData = {
      personalizations: [{
        to: [{ email: email }],
        subject: 'Contraseña Restablecida - Education PRO'
      }],
      from: { email: 'ped.torres@duocuc.cl', name: 'Education PRO' },
      content: [{
        type: 'text/html',
        value: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Restablecimiento de Contraseña</h2>
            <p>Hola ${username},</p>
            <p>Tu contraseña ha sido restablecida exitosamente.</p>
            <p>Si no realizaste esta acción, por favor contacta con soporte inmediatamente.</p>
            <br>
            <p>Saludos,<br>Equipo de Education PRO</p>
          </div>
        `
      }]
    };

    // Usar el proxy CORS para la petición
    console.log('Enviando email con datos:', emailData); // Debug
    return this.http.post(`${this.CORS_PROXY}${this.SENDGRID_API}`, emailData, { headers }).pipe(
      map(response => {
        console.log('Email enviado exitosamente:', response); // Debug
        return {
          success: true,
          message: 'Contraseña actualizada y correo enviado correctamente'
        };
      }),
      catchError(error => {
        console.error('Error detallado al enviar correo:', error); // Debug mejorado
        return of({
          success: true,
          message: `Contraseña actualizada pero hubo un error enviando el correo: ${error.message || 'Error desconocido'}`
        });
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getUserData(): Observable<any> {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return of(JSON.parse(userData));
    }
    return throwError(() => new Error('No hay usuario autenticado'));
  }

  checkUser(username: string): Observable<boolean> {
    const users = this.getUsers();
    const userExists = users.some(u => u.username === username);
    return of(userExists).pipe(delay(500));
  }

  getUserEmail(username: string): Observable<string | null> {
    const users = this.getUsers();
    const user = users.find(u => u.username === username);
    return of(user ? user.email : null).pipe(delay(500));
  }
}