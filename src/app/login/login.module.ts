import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

// Importar los módulos de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: LoginPage }]),
    MatButtonModule,        // Importar MatButtonModule para usar los botones de Angular Material
    MatInputModule,         // Importar MatInputModule para usar inputs de Angular Material
    MatFormFieldModule      // Importar MatFormFieldModule para los formularios de Angular Material
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}



