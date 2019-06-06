import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
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
    private authService: AuthService,
    private router: Router,
    private menu: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.authService.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(['collected']);
          this.menu.enable(true);
        } else {
          this.router.navigate(['login']);
          this.menu.enable(false);
        }
      });

    });
  }
}
