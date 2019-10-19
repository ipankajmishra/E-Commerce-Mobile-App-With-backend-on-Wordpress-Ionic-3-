import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Menu, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { MenuPage } from '../pages/menu/menu';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MenuPage; //MenuPage
  temp: any;

  

  constructor(public storage: Storage, public events: Events, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#660066');
      }//this.statusBar.styleDefault();
      this.splashScreen.hide();
      
  })}

  
}
