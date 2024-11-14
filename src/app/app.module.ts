import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Añadir esta línea
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthGuard } from './guards/auth.guard'; // Añadir esta línea
import { AuthService } from './services/auth.service'; // Añadir esta línea
import { IonicStorageModule } from '@ionic/storage-angular';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    MatButtonModule,
    MatInputModule,
    HttpClientModule, // Añadir esta línea
    IonicStorageModule.forRoot()
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    provideAnimationsAsync(),
    AuthGuard, // Añadir esta línea
    AuthService // Añadir esta línea
  ],
  bootstrap: [AppComponent],

})
export class AppModule {}