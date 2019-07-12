import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { QueueModule } from '@app/queue/queue.module';
import { EffectsModule } from '@ngrx/effects';
import { PlayerModule } from '@app/player/player.module';
import { API_URL } from './api-url';
import { environment } from '@environment';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([]),

    AuthModule,
    PlayerModule,
    QueueModule,
    SharedModule,
    ProfileModule,
  ],
  providers: [
    { provide: API_URL, useValue: environment.apiUrl },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
