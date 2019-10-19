import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides,NavParams, ToastController, ModalController, LoadingController, App, Events } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';
import { CartPage } from '../cart/cart';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge';
import { SearchPage } from '../search/search';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category'
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

import * as WC from 'woocommerce-api';
import { NgAnalyzeModulesHost } from '@angular/compiler';
import { NgStyle } from '@angular/common';
import { MenuPage } from '../menu/menu';

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
  temp3: any;
  categories: any[];
  mdd10: {};
  mdd: any[];
 
  constructor(private badge: Badge, public events: Events,private WP: WoocommerceProvider, public navParams: NavParams, public appCtrl: App, public navCtrl: NavController, public storage: Storage, public toastCtrl: ToastController, public ngZone: NgZone, public modalCtrl: ModalController, public loadingCtrl : LoadingController ) {
    this.temp1 = 0;
    this.categories = [];
    this.mdd = [];
   // this.searchQuery = this.navParams.get("searchQuery");
    
  this.showLoader();
    
    setTimeout(() => {
      this.loading.dismiss();
    }, 3000);
    
    this.page = 2;
    
    this.WooCommerce = WP.init();
    
    
  

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

    this.WooCommerce.getAsync("products/292").then((searchData) => {
      this.ngZone.run(() => {
        
          
     this.mdd[0] = JSON.parse(searchData.body).product;
            
       console.log(this.mdd);
          
       
       
      });});

      this.WooCommerce.getAsync("products/539").then((searchData) => {
        this.ngZone.run(() => {
          
            
       this.mdd[1] = JSON.parse(searchData.body).product;
              
         //console.log(this.mdd);
            
         
         
        });});

        this.WooCommerce.getAsync("products/280").then((searchData) => {
          this.ngZone.run(() => {
            
              
         this.mdd[2] = JSON.parse(searchData.body).product;
                
           console.log(this.mdd);
              
           
           
          });});

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

    this.ngZone.run(() => {
      this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
    console.log(JSON.parse(data.body));
      this.ngZone.run(() => {
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);
      //this.j = JSON.parse(data.body).products;
      })
      /*if(event != null)
      {
        event.complete();
      }*/

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

  });

    this.WooCommerce.getAsync("products/categories").then((data) => {
      console.log(JSON.parse(data.body).product_categories);

      let temp5: any[] = JSON.parse(data.body).product_categories;

      for( let i = 0; i < temp5.length; i ++){
        if(temp5[i].parent == 0){

          if(temp5[i].slug == "all"){
            temp5[i].icon = "albums";
            this.categories.push(temp5[i]);
            console.log(this.categories);
          }
          

        }
      }

    }, (err)=> {
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
  ionViewDidLoad(){
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

viewall(){
  this.navCtrl.push(ProductsByCategoryPage, { "category":  this.categories[0]}).then(() => {
});}


mdd10a(){
  
    //this.navCtrl.pop();
    //this.navCtrl.push(SearchPage, {"searchQuery": "mdd10a"});
    this.navCtrl.push(ProductDetailsPage, {"product": this.mdd[0]})
    
    //this.searchQuery= "searchQuery";
    //this.searchQuery = "";
    
 
}

md10c(){
  
  //this.navCtrl.pop();
  //this.navCtrl.push(SearchPage, {"searchQuery": "mdd10a"});
  this.navCtrl.push(ProductDetailsPage, {"product": this.mdd[1]})
  
  //this.searchQuery= "searchQuery";
  //this.searchQuery = "";
  

}

unoR3(){
  
  //this.navCtrl.pop();
  //this.navCtrl.push(SearchPage, {"searchQuery": "mdd10a"});
  this.navCtrl.push(ProductDetailsPage, {"product": this.mdd[2]})
  
  //this.searchQuery= "searchQuery";
  //this.searchQuery = "";
  

}

/*doRefresh(refresher) {
  this.navCtrl.push(MenuPage);
  console.log('Begin async operation', refresher);

  setTimeout(() => {
    console.log('Async operation has ended');
    refresher.complete();
  }, 2000);
}*/

doRefresh(refresher) {
  this.ionViewWillEnter();
  this.ionViewDidLoad();
  this.loadMoreProducts(event);
  console.log('Started', refresher);
  setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
  }, 3000);
}

}

