import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Auth0Service } from './services/auth0.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Login check',
      url: '/login',
      icon: 'add-circle'
    },
    {
      title: 'Collect',
      url: '/collect',
      icon: 'add-circle'
    },
    {
      title: 'Collected',
      url: '/collected',
      icon: 'list'
    },
    {
      title: 'Collection',
      url: '/collection',
      icon: 'bookmark'
    },
    {
      title: 'Collections',
      url: '/collections',
      icon: 'list'
    },
    {
      title: 'Do',
      url: '/do',
      icon: 'calendar'
    },
    {
      title: 'Event',
      url: '/event',
      icon: 'calendar'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: Auth0Service,
    private router: Router,
    private menu: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  ngOnInit() {
    this.auth.localAuthSetup();
  }
}
