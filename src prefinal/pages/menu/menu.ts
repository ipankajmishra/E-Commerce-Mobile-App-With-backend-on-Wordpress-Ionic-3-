import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController,Events, NavParams, ModalController, App  } from 'ionic-angular';
import { HomePage } from '../home/home'

import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category'
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  homePage: any;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;
  loggedIn: boolean;
  user: any;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public appCtrl: App, public storage: Storage, public modalCtrl: ModalController) {
    this.homePage = HomePage
    this.categories = [];
    this.user = {};

    this.WooCommerce = WC({
      url: "http://35.200.207.232/",
      consumerKey: "ck_349f29c988202cb1051ee2563824804083be5706",
      consumerSecret: "cs_de2719c4dc0cf0ca252dae26f74c025435f389e4"
    });

    this.WooCommerce.getAsync("products/categories").then((data) => {
      console.log(JSON.parse(data.body).product_categories);

      let temp: any[] = JSON.parse(data.body).product_categories;

      for( let i = 0; i < temp.length; i ++){
        if(temp[i].parent == 0){

          if(temp[i].slug == "all"){
            temp[i].icon = "albums";
          }
          if(temp[i].slug == "accessories"){
            temp[i].icon = "archive";
          }
          if(temp[i].slug == "small"){
            temp[i].icon = "build";
          }
          if(temp[i].slug == "sensor"){
            temp[i].icon = "finger-print";
          }
          if(temp[i].slug == "boards"){
            temp[i].icon = "easel";
          }
          this.categories.push(temp[i]);
        }
      }

    }, (err)=> {
      console.log(err)
    })
  }

  ionViewDidEnter() {
    
    this.storage.ready().then( () => {
      this.storage.get("userLoginInfo").then( (userLoginInfo) => {

        if(userLoginInfo != null){

          console.log("User logged in...");
          this.user = userLoginInfo.user;
          console.log(this.user);
          this.loggedIn = true;
        }
        else {
          console.log("No user found.");
          this.user = {};
          this.loggedIn = false;
        }

      })
    })


  }

  homemenu(){

    this.appCtrl.getRootNavs()[0].setRoot(MenuPage);

  }
  home(){

    //this.navCtrl.setRoot();
    //this.appCtrl.getRootNav().setRoot(HomePage);

  }

  openCategoryPage(category){

    this.childNavCtrl.push(ProductsByCategoryPage, { "category":  category}).then(() => {
      console.log('ionViewDidLoad ProductsByCategoryPage');
    this.events.subscribe("updateBadge", (data)=>{
      console.log("updateBadge: " + JSON.stringify(data));
      console.log('hi');
      //this.badge = data.badgeValue;
  })
    }


    );}
  

  openPage(pageName: string){
    if(pageName == "signup"){
      this.childNavCtrl.push(SignupPage);
    }
    if(pageName == "login"){
      this.childNavCtrl.push(LoginPage);
    }
    if(pageName == 'logout'){
      this.storage.remove("userLoginInfo").then( () => {
        this.user = {};
        this.loggedIn = false;
      })
    }
    if(pageName == 'cart'){
      this.childNavCtrl.push(CartPage);
     this.storage.set("route", "0");
    }

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
    this.events.subscribe("updateBadge", (data)=>{
      console.log("updateBadge: " + JSON.stringify(data));
      console.log('hi');
      //this.badge = data.badgeValue;
  })
  }

}