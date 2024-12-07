import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
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

  ngOnInit() {
    // Solicitar permisos para notificaciones locales al cargar el componente
    this.requestPermission();
  }

  async requestPermission() {
    try {
      const hasPermission = await LocalNotifications.requestPermissions();
      if (hasPermission.display === 'granted') {
        console.log('Permiso concedido para notificaciones locales');
      } else {
        console.log('Permiso denegado para notificaciones locales');
      }
    } catch (error) {
      console.error('Error al solicitar permisos para notificaciones:', error);
    }
  }

  async scheduleNotification(email: string) {
    try {
      this.requestPermission();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: '¡Contraseña actualizada!',
            body: `Hola, ${this.username}. Tu contraseña se ha restablecido correctamente.`,
            schedule: { at: new Date(new Date().getTime() + 100) }, // 5 segundos después
            actionTypeId: '',
            extra: null,
          },
        ],
      });
      console.log('Notificación programada');
    } catch (error) {
      console.error('Error al programar la notificación:', error);
    }
  }

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
      message: 'Procesando solicitud...',
    });
    await loading.present();

    this.authService.resetPassword(this.username, this.email, this.newPassword).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.presentToast(
          'Contraseña actualizada correctamente. Se ha enviado un correo de confirmación.',
          'success'
        );
        await this.scheduleNotification(this.email);
        this.router.navigate(['/login']);
      },
      error: async (error) => {
        await loading.dismiss();
        await this.presentToast(error.message || 'Error al restablecer la contraseña', 'danger');
      },
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top',
    });
    toast.present();
  }
}
