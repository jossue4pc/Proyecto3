import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ResetPasswordPage } from './reset-password.page';

// Importar los módulos de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: ResetPasswordPage }]),
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  declarations: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}



