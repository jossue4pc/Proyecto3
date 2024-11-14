import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async login() {
    if (!this.username || !this.password) {
      await this.presentToast('Por favor complete todos los campos', 'danger');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    this.authService.login(this.username, this.password).subscribe({
      next: async (response) => {
        await loading.dismiss();
        await this.presentToast('Login exitoso', 'success');
        this.router.navigate(['/home']);
      },
      error: async (error) => {
        await loading.dismiss();
        await this.presentToast(error.message || 'Error en el login', 'danger');
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}


