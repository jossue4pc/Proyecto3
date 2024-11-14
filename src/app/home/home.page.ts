import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuario: any = {};
  userData: any = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.userData = JSON.parse(userData);
      this.usuario = {
        nombre: this.userData.name,
        username: this.userData.username,
        email: this.userData.email,
        role: this.userData.role
      };
    }
  }

  editarPerfil() {
    console.log('Editar Perfil clicked');
    // Aquí iría la lógica para redirigir o editar el perfil
  }

  verEstadisticas() {
    console.log('Ver Estadísticas clicked');
    // Aquí iría la lógica para mostrar estadísticas
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}



