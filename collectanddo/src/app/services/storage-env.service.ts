import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageEnvService {

  private env_options: interfaces.EnvOptions;

  private file_options: interfaces.EnvOptions = {
    hasura_secure: environment.HASURA_SECURE,
    hasura_url: environment.HASURA_URL,
    auth_token: environment.AUTH_TOKEN,
    jwt_server: environment.JWT_SERVER,
    jwt_path: environment.JWT_PATH
  };

  constructor(
    private storage: Storage
    ) { }

  public async init() {
    return this.storage.get('env_options').then((options: interfaces.EnvOptions) => {
      if (options === null) {
        console.log('no options');
        this.env_options = this.file_options;
        this.setOptions(this.env_options);
      } else {
        console.log('si options');
        this.env_options = options;
      }
    });
  }
  public async setOptions(options: interfaces.EnvOptions) {
    return this.storage.get('env_options').then((val) => {
      this.storage.set('env_options', options);
      console.log('setting options: done');
    });
  }

  public getOptions() {
    return this.env_options;
  }
}
