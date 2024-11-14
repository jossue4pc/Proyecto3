import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  username: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async resetPassword() {
    if (!this.username || !this.email || !this.newPassword || !this.confirmPassword) {
      await this.presentToast('Por favor complete todos los campos', 'danger');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      await this.presentToast('Las contraseñas no coinciden', 'danger');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Procesando solicitud...'
    });
    await loading.present();

    this.authService.resetPassword(this.username, this.email, this.newPassword)
      .subscribe({
        next: async (response) => {
          await loading.dismiss();
          await this.presentToast('Contraseña actualizada correctamente. Se ha enviado un correo de confirmación.', 'success');
          this.router.navigate(['/login']);
        },
        error: async (error) => {
          await loading.dismiss();
          await this.presentToast(error.message || 'Error al restablecer la contraseña', 'danger');
        }
      });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}