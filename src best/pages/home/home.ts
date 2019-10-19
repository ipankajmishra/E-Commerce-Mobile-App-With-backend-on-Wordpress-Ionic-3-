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
  
 
  constructor(private badge: Badge, public events: Events, public appCtrl: App, public navCtrl: NavController, public storage: Storage, public toastCtrl: ToastController, public ngZone: NgZone, public modalCtrl: ModalController, public loadingCtrl : LoadingController ) {
    this.temp1 = 0;
    
  this.showLoader();
    
    setTimeout(() => {
      this.loading.dismiss();
    }, 3000);
    
    this.page = 2;
    
    this.WooCommerce = WC({
      url: "https://ec2.hapington.com",
      consumerKey: "ck_bd45c67e3094e0e184cf5aac9f101f63ca0c87e5",
      consumerSecret: "cs_24ff3767d19f7a7c7777e0c0a559f5e12e065003"
    });
    
    
    

    
    //this.WooCommerce = WC({
      //url: "http://happyec.happycake.co.in",
      //consumerKey: "ck_8995a7d2d8ad90a5c93da577d09b83c6127fee2b",
      //consumerSecret: "cs_67456a4cce6a89197f710ef5d6ee4f1d8d862b70"
    //});

   // this.loadMoreProducts(null);

    //this.WooCommerce.getAsync("products").then( (data) => {
      //console.log(JSON.parse(data.body));
      //this.ngZone.run(() => {
        //this.products = JSON.parse(data.body).products;
      //})
      //this.loading.dismiss();
    //}, (err) => {
     // console.log(err)  
    //})

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

   // this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
     // console.log(JSON.parse(data.body));
     // this.ngZone.run(() => {
      //this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);
      //})
      //if(event != null)
     // {
        //event.complete();
      //}

      //if(JSON.parse(data.body).products.length < 10){
        //event.enable(false);

        //this.toastCtrl.create({
          //message: "No More products!",
          //duration: 5000
        //}).present();
      //}
    //}, (err) => {
      //console.log(err)  
   // })

    
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
