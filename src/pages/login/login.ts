import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
import { MenuPage } from '../menu/menu';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;
  loading: any;

  constructor(public navCtrl: NavController, private WP: WoocommerceProvider, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, public storage: Storage, public alertCtrl: AlertController, public loadingCtrl : LoadingController) {
  
    this.username = "";
    this.password = "";
  }

  

  login(){
    this.showLoader();
    console.log("Loading page " + this.showLoader);
    this.http.get("https://happyec.in/api/auth/generate_auth_cookie/?insecure=cool&username=" + this.username + "&password=" + this.password)
    .subscribe( (res) => {
      console.log(res.json());

      let response = res.json();

      if(response.error){
        this.loading.dismiss();
        this.toastCtrl.create({
          message: response.error,
          duration: 5000
        }).present();
        return;
      }


      this.storage.set("userLoginInfo", response).then( (data) =>{
        this.loading.dismiss();
      console.log("Done Loading " + this.loading);

        this.alertCtrl.create({
          title: "Login Successful",
          message: "You have been logged in successfully.",
          buttons: [{
            text: "OK",
            handler: () => {
              if(this.navParams.get("next")){
                this.navCtrl.pop();
                this.navCtrl.push(this.navParams.get("next"));
              } else {
                //this.navCtrl.push(MenuPage);
                this.navCtrl.pop();
                //this.navCtrl.setRoot(MenuPage);
              }             
            }
          }]
        }).present();


      })




    });



  }
  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

}