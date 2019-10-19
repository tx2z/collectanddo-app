import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../services/auth0.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
  styleUrls: ['./callback.page.scss']
})
export class CallbackPage implements OnInit {

  constructor(private auth: Auth0Service) { }

  ngOnInit() {
    this.auth.handleAuthCallback();
  }

}
