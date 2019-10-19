import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides, ToastController, ModalController, LoadingController, App, Events } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';
import { CartPage } from '../cart/cart';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge';
import { SearchPage } from '../search/search';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  @ViewChild('content') childNavCtrl: NavController;
  page: number;
  loading: any;
  temp: any;
  temp1: any;
  searchQuery: string = "";
  j: any[];
  i: any;
 
  constructor(private badge: Badge, public events: Events, public appCtrl: App, public navCtrl: NavController, public storage: Storage, public toastCtrl: ToastController, public ngZone: NgZone, public modalCtrl: ModalController, public loadingCtrl : LoadingController ) {
    this.temp1 = 0;
    
  this.showLoader();
    
    setTimeout(() => {
      this.loading.dismiss();
    }, 3000);
    
    this.page = 2;
    
    this.WooCommerce = WC({
      url: "http://35.200.207.232/",
      consumerKey: "ck_349f29c988202cb1051ee2563824804083be5706",
      consumerSecret: "cs_de2719c4dc0cf0ca252dae26f74c025435f389e4"
    });
    
    
  

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then( (data) => {
      console.log(JSON.parse(data.body));
      this.ngZone.run(() => {
        this.products = JSON.parse(data.body).products;
      })
      this.loading.dismiss();
    }, (err) => {
      console.log(err)  
    })

  }
  
  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Connecting wires for you...'
    });
    this.loading.present();
  }

  loadMoreProducts(event){
    if(event == null)
    {
    this.page = 1;
    this.moreProducts = [];
    }
    else
    this.page ++;

    this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
    console.log(JSON.parse(data.body));
      this.ngZone.run(() => {
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);
      //this.j = JSON.parse(data.body).products;
      })
      if(event != null)
      {
        event.complete();
      }

      if(JSON.parse(data.body).products.length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No More products!",
          duration: 5000
        }).present();
      }
    }, (err) => {
      console.log(err)  
    })

    
    }
    openProductPage(product){
      this.navCtrl.push(ProductDetailsPage, {"product": product})
  }

  openCart(){

    //this.modalCtrl.create(CartPage).present();
    this.navCtrl.push(CartPage);
    this.storage.set("route", "0");
    //this.appCtrl.getRootNavs()[0].push(CartPage);
    //this.childNavCtrl.push(CartPage);

  }
  ionViewWillEnter(){
    this.storage.get("finalcartlength").then((data)=>{
      console.log("start", data);
      this.temp = data;
      if(this.temp > 0){
      this.events.publish("updateBadge", {"badgeValue": this.temp});
      this.badge = this.temp;}
      else{
        this.events.publish("updateBadge", {"badgeValue": 0});
        this.badge = this.temp1;
      }
  });
  }
  ionViewdidLoad(){
    this.storage.get("finalcartlength").then((data)=>{
      console.log("start", data);
      this.temp = data;
      if(this.temp > 0){
      this.events.publish("updateBadge", {"badgeValue": this.temp});
      this.badge = this.temp;}
      else{
        this.events.publish("updateBadge", {"badgeValue": 0});
        this.badge = this.temp1;
      }
  });
  }
  //ionViewWillEnter(){this.events.subscribe("updateBadge", (data)=>{
    //console.log("updateBadge: " + JSON.stringify(data));
    //console.log('hi');
    //if(data.badgeValue >= 0){
    //this.badge = data.badgeValue;}
    //else
    //{
      //console.log("[OBJECT OBJECT] error");
    //}
//})}
onSearch(){
  if(this.searchQuery.length > 0){
    this.navCtrl.push(SearchPage, {"searchQuery": this.searchQuery});
    this.searchQuery = "";
  }

  //this.navCtrl.push(SearchPage);
}

}
