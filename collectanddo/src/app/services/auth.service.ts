import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { StorageEnvService } from './storage-env.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string;
  public user: string = null;
  public userToken: string = null;
  public authenticationState = new BehaviorSubject(false);
  private envOptions: interfaces.EnvOptions;

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage,
    private plt: Platform,
    private alertController: AlertController,
    private storageEnv: StorageEnvService
    ) {
      this.envOptions = storageEnv.getOptions();
      this.url = this.envOptions.jwt_server + this.envOptions.jwt_path;
      this.plt.ready().then(() => {
        this.checkToken();
      });
    }

  checkToken() {
    this.storage.get(this.envOptions.auth_token).then(token => {
      if (token) {
        const decoded = this.helper.decodeToken(token);
        const isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.userToken = token;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(this.envOptions.auth_token);
        }
      }
    });
  }

  register(credentials) {
    return this.http.post(`${this.url}/register`, credentials).pipe(
      catchError(e => {

        console.log(e);
        this.showAlert(e);
        throw new Error(e);
      })
    );
  }

  login(credentials) {
    return this.http.post(`${this.url}/login`, credentials)
      .pipe(
        tap(res => {
          this.storage.set(this.envOptions.auth_token, res['token']);
          this.user = this.helper.decodeToken(res['token']);
          this.userToken = res['token'];
          this.authenticationState.next(true);
        }),
        catchError(e => {
          console.log(e);
          this.showAlert(e);
          throw new Error(e);
        })
      );
  }

  logout() {
    this.storage.remove(this.envOptions.auth_token).then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  async showAlert(msg) {
    const alert = await this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    return await alert.present();
  }
}
