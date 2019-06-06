import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageEnvService } from '../services/storage-env.service';

import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  private optionsForm: FormGroup;
  public hasura_secure: boolean;
  public options: interfaces.EnvOptions;

  constructor(
    private formBuilder: FormBuilder,
    private storageEnv: StorageEnvService,
    public alertController: AlertController,
    private modalController: ModalController,
  ) {
    this.options = this.storageEnv.getOptions();
  }

  ngOnInit() {
    console.log(this.options);
    this.optionsForm = this.formBuilder.group({
      hasura_url:    [this.options.hasura_url, [Validators.required]],
      hasura_secure: [this.options.hasura_secure],
      auth_token:    [this.options.auth_token, [Validators.required]],
      jwt_server:    [this.options.jwt_server, [Validators.required]],
      jwt_path:      [this.options.jwt_path,   []]
    });

    this.hasura_secure = this.options.hasura_secure;
  }

  onSubmit() {
    console.log(this.optionsForm.value);
    this.storageEnv.setOptions(this.optionsForm.value).then(() => {
      this.presentAlert();
      this.closeModal();
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Your options have been saved sucesfully.',
      buttons: ['OK']
    });
    return await alert.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
