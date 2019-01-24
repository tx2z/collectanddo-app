import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { StorageEnvService } from './services/storage-env.service';

export function init(storageEnv: StorageEnvService) {
  return () => storageEnv.init();
}

export function jwtOptionsFactory(storage: Storage, storageEnv: StorageEnvService) {
  return {
    tokenGetter: () => {
      const options: interfaces.EnvOptions = storageEnv.getOptions();
      return storage.get(options.auth_token);
    },
    whitelistedDomains: () => {
      const options: interfaces.EnvOptions = storageEnv.getOptions();
      console.log(options.jwt_server);
      return [options.jwt_server];
    }
  };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage, StorageEnvService],
      }
    })
  ],
  providers: [
    StorageEnvService,
    { provide: APP_INITIALIZER, useFactory: init, deps: [StorageEnvService], multi: true },
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
