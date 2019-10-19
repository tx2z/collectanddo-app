import { Component, OnInit } from '@angular/core';
import { Auth0Service } from 'src/app/services/auth0.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public auth: Auth0Service
    ) { }

  ngOnInit() {}

}
